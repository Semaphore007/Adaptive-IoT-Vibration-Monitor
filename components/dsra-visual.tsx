'use client'

import { useMemo, useState } from 'react'
import { mulberry32 } from '@/lib/simulation'
import { ChartCard, LineChart } from './line-chart'

const N = 240

function makeSignal() {
  const rand = mulberry32(11)
  return Array.from({ length: N }, (_, i) => {
    const burst = i > 90 && i < 150 ? 1 : 0.2
    return burst * (Math.sin(i / 3) + 0.4 * Math.sin(i / 1.3)) + (rand() - 0.5) * 0.08
  })
}

/** Change-driven sample selection + linear reconstruction. Conceptual illustration, not the DSRA-PMLO algorithm. */
function selectAndReconstruct(signal: number[], tolerance: number) {
  const selected: number[] = [0]
  for (let i = 1; i < signal.length - 1; i++) {
    const last = selected[selected.length - 1]
    if (Math.abs(signal[i] - signal[last]) > tolerance || i - last > 30) selected.push(i)
  }
  selected.push(signal.length - 1)
  const recon = new Array<number>(signal.length)
  for (let k = 0; k < selected.length - 1; k++) {
    const a = selected[k]
    const b = selected[k + 1]
    for (let i = a; i <= b; i++) recon[i] = signal[a] + ((signal[b] - signal[a]) * (i - a)) / (b - a || 1)
  }
  const rmse = Math.sqrt(signal.reduce((s, v, i) => s + (v - recon[i]) ** 2, 0) / signal.length)
  return { selected, recon, rmse }
}

export function DsraVisual() {
  const [tol, setTol] = useState(0.25)
  const signal = useMemo(makeSignal, [])
  const { selected, recon, rmse } = useMemo(() => selectAndReconstruct(signal, tol), [signal, tol])
  const reduction = (1 - selected.length / N) * 100

  return (
    <ChartCard
      title="Sample selection & reconstruction"
      label="CONCEPTUAL SIMULATION"
      description="Illustrates the idea behind adaptive sample selection. This is not the DSRA-PMLO implementation — see the external repository for the real method."
    >
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="dsra-tol" className="text-sm font-medium">Selection tolerance</label>
          <output htmlFor="dsra-tol" className="font-mono text-xs">{tol.toFixed(2)}</output>
        </div>
        <input id="dsra-tol" type="range" min={0.05} max={0.8} step={0.05} value={tol} onChange={(e) => setTol(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
      </div>
      <LineChart
        xLabel="Sample index"
        xMax={N}
        series={[
          { name: 'Original signal', color: 'var(--chart-5)', data: signal },
          { name: 'Reconstructed', color: 'var(--chart-1)', data: recon, dashed: true },
        ]}
        markers={selected.map((i) => ({ index: i, color: 'var(--chart-2)' }))}
        yLabel="amplitude; ticks = selected samples"
      />
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {(
          [
            ['Selected', `${selected.length}/${N}`],
            ['Reduction', `${reduction.toFixed(1)}%`],
            ['RMSE', rmse.toFixed(3)],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="rounded-md bg-muted px-2 py-2">
            <dt className="text-[11px] text-muted-foreground">{k}</dt>
            <dd className="font-mono text-sm font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
    </ChartCard>
  )
}
