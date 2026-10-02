'use client'

import { useMemo, useState } from 'react'
import { DEFAULT_PARAMS, generateSeries, summarize, type SimParams } from '@/lib/simulation'
import { cn } from '@/lib/utils'
import { ChartCard, LineChart } from './line-chart'

const SWEEPS: { key: keyof SimParams; label: string; values: number[]; unit: string }[] = [
  { key: 'sensitivity', label: 'Sensitivity', values: [0, 0.2, 0.4, 0.6, 0.8, 1], unit: '' },
  { key: 'baseInterval', label: 'Base interval', values: [50, 100, 200, 400, 700, 1000], unit: 'ms' },
  { key: 'txInterval', label: 'Transmission interval', values: [200, 500, 1000, 2000, 3500, 5000], unit: 'ms' },
  { key: 'threshold', label: 'Threshold', values: [0.3, 0.45, 0.6, 0.8, 1.0, 1.3], unit: 'g' },
]

export function SensitivityPanel() {
  const [key, setKey] = useState<keyof SimParams>('txInterval')
  const sweep = SWEEPS.find((s) => s.key === key) ?? SWEEPS[0]

  const results = useMemo(
    () => sweep.values.map((v) => summarize(generateSeries(400, { ...DEFAULT_PARAMS, [sweep.key]: v }))!),
    [sweep],
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Parameter to sweep">
        {SWEEPS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={key === s.key}
            onClick={() => setKey(s.key)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium',
              key === s.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-accent',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title={`Packet reduction & relative energy vs ${sweep.label.toLowerCase()}`} label="SIMULATION OUTPUT">
          <LineChart
            xLabel={`${sweep.label} (${sweep.values[0]}–${sweep.values[sweep.values.length - 1]}${sweep.unit})`}
            xMax={sweep.values[sweep.values.length - 1]}
            yMin={0}
            yMax={100}
            yLabel="%"
            series={[
              { name: 'Packet reduction %', color: 'var(--chart-2)', data: results.map((r) => r.packetReductionPct) },
              { name: 'Relative energy %', color: 'var(--chart-4)', data: results.map((r) => r.energyRelative * 100) },
            ]}
          />
        </ChartCard>
        <ChartCard title={`Detection agreement & latency vs ${sweep.label.toLowerCase()}`} label="SIMULATION OUTPUT">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Sweep results</caption>
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th scope="col" className="pb-2 font-medium">{sweep.label}</th>
                  <th scope="col" className="pb-2 font-medium">Agreement</th>
                  <th scope="col" className="pb-2 font-medium">Mean latency</th>
                  <th scope="col" className="pb-2 font-medium">Packets</th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {results.map((r, i) => (
                  <tr key={sweep.values[i]} className="border-t border-border">
                    <th scope="row" className="py-2 text-left font-medium">{sweep.values[i]}{sweep.unit}</th>
                    <td className="py-2">{r.agreementPct.toFixed(1)}%</td>
                    <td className="py-2">{r.meanLatency.toFixed(0)} ms</td>
                    <td className="py-2">{r.packetsAdaptive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
