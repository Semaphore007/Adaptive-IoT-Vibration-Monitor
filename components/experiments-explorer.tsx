'use client'

import { useMemo, useState } from 'react'
import { EXPERIMENTS } from '@/lib/project-data'
import { BASELINE_SAMPLING_HZ, BASELINE_TX_HZ, DEFAULT_PARAMS, generateSeries, summarize } from '@/lib/simulation'
import { cn } from '@/lib/utils'
import { ChartCard, LineChart } from './line-chart'

const CONFIGS = [
  { id: 'baseline', label: 'Baseline' },
  { id: 'threshold', label: 'Threshold Adaptive' },
  { id: 'dsra', label: 'DSRA-PMLO (conceptual)' },
  { id: 'tx', label: 'Adaptive Transmission' },
  { id: 'edge', label: 'Edge Processing' },
] as const
type ConfigId = (typeof CONFIGS)[number]['id']

export function ExperimentsExplorer() {
  const [active, setActive] = useState('A')
  const [config, setConfig] = useState<ConfigId>('threshold')
  const exp = EXPERIMENTS.find((e) => e.id === active) ?? EXPERIMENTS[0]

  const series = useMemo(() => generateSeries(400, DEFAULT_PARAMS), [])
  const summary = useMemo(() => summarize(series), [series])

  const chart = useMemo(() => {
    const t = series.map((s) => s.t)
    switch (config) {
      case 'baseline':
        return { yLabel: 'Hz', series: [{ name: 'Baseline sampling', color: 'var(--chart-5)', data: t.map(() => BASELINE_SAMPLING_HZ) }] }
      case 'threshold':
        return {
          yLabel: 'Hz',
          series: [
            { name: 'Baseline', color: 'var(--chart-5)', data: t.map(() => BASELINE_SAMPLING_HZ), dashed: true },
            { name: 'Adaptive sampling', color: 'var(--chart-1)', data: series.map((s) => s.samplingRate), step: true },
          ],
        }
      case 'dsra':
        return {
          yLabel: 'g',
          series: [
            { name: 'Vibration', color: 'var(--chart-5)', data: series.map((s) => s.vibration) },
            { name: 'Selected-sample envelope', color: 'var(--chart-3)', data: series.map((s) => s.level) },
          ],
        }
      case 'tx':
        return {
          yLabel: 'packets',
          series: [
            { name: 'Baseline packets', color: 'var(--chart-5)', data: series.map((s) => s.baselinePackets), dashed: true },
            { name: 'Adaptive packets', color: 'var(--chart-2)', data: series.map((s) => s.packetsSent) },
          ],
        }
      case 'edge':
        return {
          yLabel: 'runs/s',
          series: [
            { name: 'Baseline processing', color: 'var(--chart-5)', data: t.map(() => BASELINE_TX_HZ), dashed: true },
            { name: 'Adaptive processing', color: 'var(--chart-4)', data: series.map((s) => s.processingRate), step: true },
          ],
        }
    }
  }, [config, series])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Experiments">
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {EXPERIMENTS.map((e) => (
              <li key={e.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(e.id)}
                  aria-pressed={active === e.id}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                    active === e.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent',
                  )}
                >
                  <span className={cn('inline-flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold', active === e.id ? 'bg-primary-foreground/20' : 'bg-secondary text-primary')}>
                    {e.label}
                  </span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{e.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <article className="rounded-lg border border-border bg-card p-6" aria-live="polite">
          <p className="font-mono text-xs font-semibold text-primary">Experiment {exp.label}</p>
          <h3 className="mt-1 text-xl font-bold">{exp.title}</h3>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {(
              [
                ['Objective', exp.objective],
                ['Variables', exp.variables],
                ['Procedure', exp.procedure],
                ['Metrics', exp.metrics],
                ['Expected observation', exp.expected],
                ['Data source', exp.dataSource],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k}</dt>
                <dd className="mt-1 text-sm leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            Expected observations are hypotheses to test, not reported results.
          </p>
        </article>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Configuration">
          {CONFIGS.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={config === c.id}
              onClick={() => setConfig(c.id)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                config === c.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <ChartCard
            title={`${CONFIGS.find((c) => c.id === config)?.label} over a stable → moderate → high → stable scenario`}
            label={config === 'dsra' ? 'CONCEPTUAL SIMULATION' : 'DEMO DATA'}
            description="Generated by the in-browser simulation model. Replace with your experimental CSV on the Results page."
          >
            <LineChart series={chart.series} yLabel={chart.yLabel} xMax={series[series.length - 1]?.t} />
          </ChartCard>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Scenario summary (simulation)</h3>
            {summary && (
              <dl className="mt-4 space-y-3 text-sm">
                {(
                  [
                    ['Packets: baseline → adaptive', `${summary.packetsBaseline} → ${summary.packetsAdaptive}`],
                    ['Packet reduction', `${summary.packetReductionPct.toFixed(1)}%`],
                    ['Relative energy (model)', `${(summary.energyRelative * 100).toFixed(1)}%`],
                    ['Detection agreement (model)', `${summary.agreementPct.toFixed(1)}%`],
                    ['Mean sampling rate', `${summary.meanSamplingRate.toFixed(1)} Hz`],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-border pb-2 last:border-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-mono tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-4 text-[11px] text-muted-foreground">Model outputs only — not measured performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
