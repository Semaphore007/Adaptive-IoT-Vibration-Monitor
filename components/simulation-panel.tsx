'use client'

import {
  Activity,
  BatteryCharging,
  CircleCheck,
  CircleAlert,
  Gauge,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Send,
  Timer,
  Upload,
  Cpu,
  ShieldOff,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { parseCsv } from '@/lib/csv'
import {
  BASELINE_SAMPLING_HZ,
  createSimulator,
  DEFAULT_PARAMS,
  type DataSource,
  type SimParams,
  type SimSample,
  type VibrationMode,
} from '@/lib/simulation'
import { cn } from '@/lib/utils'
import { LineChart } from './line-chart'
import { MetricCard } from './metric-card'
import { DataBadge } from './primitives'

const WINDOW = 200
const TICK_MS = 50
const MODES: { id: VibrationMode; label: string; className: string }[] = [
  { id: 'stable', label: 'Stable', className: 'data-[on=true]:bg-primary data-[on=true]:text-primary-foreground' },
  { id: 'moderate', label: 'Moderate', className: 'data-[on=true]:bg-[#f59e0b] data-[on=true]:text-[#1f1300]' },
  { id: 'high', label: 'High', className: 'data-[on=true]:bg-destructive data-[on=true]:text-white' },
  { id: 'random', label: 'Random', className: 'data-[on=true]:bg-info data-[on=true]:text-white' },
]

interface LogEntry {
  t: number
  text: string
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="min-w-16 rounded border border-border bg-background px-2 py-0.5 text-right font-mono text-xs tabular-nums">
          {value}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-[var(--primary)]"
      />
    </div>
  )
}

export function SimulationPanel() {
  const simRef = useRef(createSimulator(42))
  const replayRef = useRef<number[] | null>(null)
  const replayIdx = useRef(0)
  const prevState = useRef<string>('Stable')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState<VibrationMode>('stable')
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS)
  const [source, setSource] = useState<DataSource>('DEMO')
  const [samples, setSamples] = useState<SimSample[]>([])
  const [log, setLog] = useState<LogEntry[]>([])
  const [replayInfo, setReplayInfo] = useState<string | null>(null)
  const [infoPanel, setInfoPanel] = useState<{ title: string; body: string; tone: 'info' | 'warn' } | null>(null)

  const latest = samples[samples.length - 1]

  const tick = useCallback(() => {
    let external: number | undefined
    if (source === 'REPLAY' && replayRef.current) {
      const arr = replayRef.current
      external = arr[replayIdx.current % arr.length]
      replayIdx.current++
    }
    const s = simRef.current.next(mode, params, external)
    setSamples((prev) => {
      const next = prev.length >= WINDOW ? prev.slice(prev.length - WINDOW + 1) : prev.slice()
      next.push(s)
      return next
    })
    if (s.state !== prevState.current) {
      const text =
        s.state === 'Abnormal'
          ? `Abnormal vibration detected → sampling ${s.samplingRate} Hz, immediate transmission`
          : s.state === 'Moderate'
            ? `Moderate vibration → sampling ${s.samplingRate} Hz`
            : `Stable conditions → sampling reduced to ${s.samplingRate} Hz, transmissions deferred`
      prevState.current = s.state
      setLog((l) => [{ t: s.t, text }, ...l].slice(0, 30))
    }
  }, [mode, params, source])

  useEffect(() => {
    if (!running) return
    const id = setInterval(tick, TICK_MS)
    return () => clearInterval(id)
  }, [running, tick])

  function reset() {
    setRunning(false)
    simRef.current.reset(42)
    replayIdx.current = 0
    prevState.current = 'Stable'
    setSamples([])
    setLog([])
  }

  function handleSourceChange(nextSource: DataSource) {
    setSource(nextSource)
    reset()

    if (nextSource === 'DEMO') {
      setReplayInfo('Demo mode is active. Use replay for recorded traces or live mode for a connected stream.')
      setInfoPanel({
        title: 'Demo source',
        body: 'Demo mode generates a synthetic vibration trace so you can test adaptive sampling without external data or hardware.',
        tone: 'info',
      })
      return
    }

    if (nextSource === 'REPLAY') {
      if (!replayRef.current) {
        setReplayInfo('No replay file loaded yet. Select a CSV with a vibration column to start replay.')
        setInfoPanel({
          title: 'Replay data required',
          body: 'Upload a CSV file containing a vibration column to replay captured motor activity and compare the adaptive algorithm against the original signal.',
          tone: 'info',
        })
        fileInputRef.current?.click()
        return
      }

      setReplayInfo(`${replayRef.current.length} replay samples ready.`)
      setInfoPanel({
        title: 'Replay mode',
        body: 'The simulator will iterate through the uploaded vibration samples in sequence and visualise adaptive versus baseline behaviour.',
        tone: 'info',
      })
      return
    }

    setInfoPanel({
      title: 'Live mode is not connected',
      body: 'This deployment does not include the MQTT/WebSocket bridge required for real sensor streaming. Use demo or replay mode until a live backend is configured.',
      tone: 'warn',
    })
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const parsed = parseCsv(await file.text())
      const values = parsed.rows.map((r) => r.vibration).filter((v): v is number => v !== undefined)
      if (values.length === 0) throw new Error('No "vibration" column found in this CSV.')
      replayRef.current = values
      setReplayInfo(`${file.name}: ${values.length} vibration samples loaded`)
      setSource('REPLAY')
      reset()
    } catch (err) {
      setReplayInfo(err instanceof Error ? err.message : 'Could not read the file.')
    }
    e.target.value = ''
  }

  const update = (k: keyof SimParams) => (v: number) => setParams((p) => ({ ...p, [k]: v }))
  const sourceLabel = source === 'REPLAY' ? 'REPLAY DATA' : 'DEMO DATA'
  const reduction = latest ? ((latest.packetsAvoided / latest.baselinePackets) * 100).toFixed(0) : '0'

  const stateTone = latest?.state === 'Abnormal' ? 'warn' : latest?.state === 'Moderate' ? 'info' : 'primary'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <section aria-labelledby="sim-controls" className="rounded-lg border border-border bg-card p-5">
          <h2 id="sim-controls" className="font-semibold">
            Simulation Controls
          </h2>

          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-medium">Data source</legend>
            <div className="grid grid-cols-3 gap-1.5 rounded-md bg-muted p-1 text-xs">
              {(['DEMO', 'REPLAY', 'LIVE'] as DataSource[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={source === s}
                  onClick={() => handleSourceChange(s)}
                  className={cn(
                    'rounded px-2 py-1.5 font-semibold transition-colors',
                    source === s ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="flex cursor-pointer flex-1 items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:border-primary/50">
                <Upload className="size-3.5" aria-hidden="true" />
                Load CSV for replay
                <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={onFile} />
              </label>
              <button
                type="button"
                onClick={() => setInfoPanel({
                  title: 'Simulation notes',
                  body: 'DEMO generates synthetic vibration patterns. REPLAY transforms uploaded CSV traces into the same adaptive model. LIVE requires a working MQTT/WebSocket bridge in a connected deployment.',
                  tone: 'info',
                })}
                className="rounded-md border border-border bg-background px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
              >
                Info
              </button>
            </div>
            {replayInfo && <p className="mt-1.5 text-xs text-muted-foreground" role="status">{replayInfo}</p>}
            {infoPanel && (
              <details className={cn('mt-2 rounded-md border text-xs leading-relaxed', infoPanel.tone === 'warn' ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200' : 'border-primary/20 bg-primary/5 text-foreground')}>
                <summary className="cursor-pointer list-none px-3 py-2 font-semibold">
                  {infoPanel.title}
                </summary>
                <p className="border-t border-current/15 px-3 py-2">{infoPanel.body}</p>
              </details>
            )}
            <p className="mt-1.5 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
              <ShieldOff className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              LIVE requires a configured WebSocket/MQTT bridge and is not connected in this deployment.
            </p>
          </fieldset>

          <fieldset className="mt-5" disabled={source === 'REPLAY'}>
            <legend className="mb-2 text-sm font-medium">Vibration mode</legend>
            <div className="grid grid-cols-4 gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-on={mode === m.id}
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn('rounded-md border border-border px-1 py-1.5 text-xs font-semibold transition-colors hover:bg-accent disabled:opacity-50', m.className)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 space-y-4">
            <Slider id="s-sens" label="Sensitivity" value={params.sensitivity} min={0} max={1} step={0.05} onChange={update('sensitivity')} />
            <Slider id="s-base" label="Base Sampling Interval" value={params.baseInterval} min={50} max={1000} step={50} unit=" ms" onChange={update('baseInterval')} />
            <Slider id="s-tx" label="Transmission Interval" value={params.txInterval} min={200} max={5000} step={100} unit=" ms" onChange={update('txInterval')} />
            <Slider id="s-th" label="Detection Threshold" value={params.threshold} min={0.2} max={1.5} step={0.05} unit=" g" onChange={update('threshold')} />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setRunning(true)} disabled={running} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-60">
              <Play className="size-4" aria-hidden="true" /> Start
            </button>
            <button type="button" onClick={() => setRunning(false)} disabled={!running} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-60">
              <Pause className="size-4" aria-hidden="true" /> Pause
            </button>
            <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent">
              <RotateCcw className="size-4" aria-hidden="true" /> Reset
            </button>
          </div>
        </section>

        <div className="grid gap-6">
          <figure className="rounded-lg border border-border bg-card p-5">
            <figcaption className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Live Vibration Signal</h2>
              <DataBadge label={sourceLabel} />
            </figcaption>
            {samples.length === 0 ? (
              <div className="bg-grid flex h-48 items-center justify-center rounded-md text-sm text-muted-foreground">Press Start to run the simulation.</div>
            ) : (
              <LineChart
                series={[
                  { name: 'Vibration (g)', color: 'var(--chart-1)', data: samples.map((s) => s.vibration) },
                  { name: 'RMS level', color: 'var(--chart-4)', data: samples.map((s) => s.level), dashed: true },
                ]}
                markers={samples.flatMap((s, i) => (s.sampled ? [{ index: i, color: 'var(--chart-2)' }] : []))}
                yMin={-2.5}
                yMax={2.5}
                xMax={latest?.t}
                yLabel="acceleration (g); ticks = samples taken"
              />
            )}
          </figure>
          <figure className="rounded-lg border border-border bg-card p-5">
            <figcaption className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-semibold">Sampling Rate: Adaptive vs Baseline</h2>
              <DataBadge label="SIMULATION OUTPUT" />
            </figcaption>
            {samples.length === 0 ? (
              <div className="bg-grid flex h-32 items-center justify-center rounded-md text-sm text-muted-foreground">No samples yet.</div>
            ) : (
              <LineChart
                height="h-32"
                series={[
                  { name: 'Baseline (fixed)', color: 'var(--chart-5)', data: samples.map(() => BASELINE_SAMPLING_HZ), dashed: true },
                  { name: 'Adaptive', color: 'var(--chart-1)', data: samples.map((s) => s.samplingRate), step: true },
                ]}
                yMin={0}
                yMax={110}
                xMax={latest?.t}
                yLabel="Hz"
              />
            )}
          </figure>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-live="polite" aria-atomic="false">
        <MetricCard icon={Activity} tone="info" title="Acceleration (g)" value={latest ? latest.vibration.toFixed(2) : '—'} />
        <MetricCard icon={Gauge} tone={stateTone} title="Vibration state" value={latest?.state ?? '—'} />
        <MetricCard icon={Activity} title="Sampling rate" value={latest ? `${latest.samplingRate} Hz` : '—'} />
        <MetricCard icon={Send} tone="teal" title="Transmission rate" value={latest ? `${latest.transmissionRate} /s` : '—'} />
        <MetricCard icon={Cpu} tone="info" title="Processing rate" value={latest ? `${latest.processingRate} /s` : '—'} />
        <MetricCard icon={Radio} tone="teal" title="Packets sent" value={latest ? String(latest.packetsSent) : '0'} />
        <MetricCard icon={Radio} title={`Packets avoided (${reduction}%)`} value={latest ? String(latest.packetsAvoided) : '0'} />
        <MetricCard icon={BatteryCharging} tone="warn" title="Est. relative energy" value={latest ? `${(latest.energyRelative * 100).toFixed(0)}%` : '—'} />
        <MetricCard icon={Timer} tone="info" title="Est. detection latency" value={latest ? `${latest.latency} ms` : '—'} />
        <MetricCard
          icon={latest?.detection ? CircleAlert : CircleCheck}
          tone={latest?.detection ? 'warn' : 'primary'}
          title="Detection status"
          value={latest?.detection ? 'Abnormal' : 'Normal'}
        />
      </div>

      <section aria-labelledby="event-log" className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 id="event-log" className="font-semibold">
            Event Log
          </h2>
          <DataBadge label="SIMULATION OUTPUT" />
        </div>
        <ol className="mt-3 max-h-48 space-y-1 overflow-y-auto font-mono text-xs" role="log" aria-live="polite">
          {log.length === 0 && <li className="text-muted-foreground">No state changes yet.</li>}
          {log.map((e, i) => (
            <li key={`${e.t}-${i}`} className="flex gap-3">
              <span className="w-14 shrink-0 text-muted-foreground">t={e.t.toFixed(1)}s</span>
              <span>{e.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Energy, packets and latency values above are model estimates of an educational simulation, not hardware measurements. Relative energy is normalised to a fixed-rate baseline (100%).
        </p>
      </section>
    </div>
  )
}
