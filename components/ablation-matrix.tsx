'use client'

import { useMemo, useState } from 'react'
import { BASELINE_PROCESSING_HZ, BASELINE_SAMPLING_HZ, BASELINE_TX_HZ, DEFAULT_PARAMS, generateSeries, STEP_SECONDS } from '@/lib/simulation'
import { BarList, ChartCard } from './line-chart'

const MECHANISMS = [
  { id: 'sampling', label: 'Adaptive sampling' },
  { id: 'transmission', label: 'Adaptive transmission' },
  { id: 'processing', label: 'Adaptive edge processing' },
] as const
type Mech = (typeof MECHANISMS)[number]['id']

export function AblationMatrix() {
  const [on, setOn] = useState<Record<Mech, boolean>>({ sampling: true, transmission: true, processing: true })
  const series = useMemo(() => generateSeries(400, DEFAULT_PARAMS), [])

  const result = useMemo(() => {
    let energy = 0
    let samples = 0
    let processing = 0
    for (const s of series) {
      const sr = on.sampling ? s.samplingRate : BASELINE_SAMPLING_HZ
      const tr = on.transmission ? Math.min(BASELINE_TX_HZ, s.transmissionRate) : BASELINE_TX_HZ
      const pr = on.processing ? s.processingRate : BASELINE_PROCESSING_HZ
      energy += (0.35 + 0.35 * (sr / BASELINE_SAMPLING_HZ) + 0.25 * (tr / BASELINE_TX_HZ) + 0.05 * (pr / BASELINE_PROCESSING_HZ)) * STEP_SECONDS
      samples += sr * STEP_SECONDS
      processing += pr * STEP_SECONDS
    }
    const duration = series.length * STEP_SECONDS
    const last = series[series.length - 1]
    const packets = on.transmission ? last.packetsSent : last.baselinePackets
    return {
      energy: (1 - energy / duration) * 100,
      samples: (1 - samples / (BASELINE_SAMPLING_HZ * duration)) * 100,
      packets: (1 - packets / last.baselinePackets) * 100,
      processing: (1 - processing / (BASELINE_PROCESSING_HZ * duration)) * 100,
    }
  }, [on, series])

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <fieldset className="rounded-lg border border-border bg-card p-5">
        <legend className="sr-only">Enabled mechanisms</legend>
        <h3 className="text-sm font-semibold">Enabled mechanisms</h3>
        <p className="mt-1 text-xs text-muted-foreground">Toggle mechanisms to see their modelled contribution relative to the fixed-rate baseline.</p>
        <div className="mt-4 space-y-2">
          {MECHANISMS.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm hover:bg-accent">
              <input
                type="checkbox"
                checked={on[m.id]}
                onChange={(e) => setOn((p) => ({ ...p, [m.id]: e.target.checked }))}
                className="size-4 accent-[var(--primary)]"
              />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>
      <ChartCard title="Modelled reduction vs baseline" label="SIMULATION OUTPUT" description="Percent reduction in each quantity for the selected combination. Educational model, not measured data.">
        <BarList
          unit="%"
          items={[
            { label: 'Estimated energy', value: result.energy, color: 'var(--chart-4)' },
            { label: 'Samples acquired', value: result.samples, color: 'var(--chart-1)' },
            { label: 'Packets transmitted', value: result.packets, color: 'var(--chart-2)' },
            { label: 'Edge processing runs', value: result.processing, color: 'var(--chart-3)' },
          ]}
        />
      </ChartCard>
    </div>
  )
}
