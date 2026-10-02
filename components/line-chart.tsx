import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { DataBadge, type DataLabel } from './primitives'

export interface Series {
  name: string
  color: string
  data: number[]
  step?: boolean
  dashed?: boolean
}

const W = 600
const H = 200

function buildPath(data: number[], min: number, max: number, step?: boolean) {
  const span = max - min || 1
  const n = data.length
  return data
    .map((v, i) => {
      const x = (i / Math.max(1, n - 1)) * W
      const y = H - ((v - min) / span) * H
      if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`
      if (step) {
        const prevY = H - ((data[i - 1] - min) / span) * H
        return `L${x.toFixed(1)},${prevY.toFixed(1)}L${x.toFixed(1)},${y.toFixed(1)}`
      }
      return `L${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join('')
}

const fmt = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(2))

/** Lightweight responsive SVG line chart; theme colours come from CSS variables. */
export function LineChart({
  series,
  yLabel,
  xLabel = 'Time (s)',
  xMax,
  yMin,
  yMax,
  height = 'h-48',
  markers,
}: {
  series: Series[]
  yLabel?: string
  xLabel?: string
  xMax?: number
  yMin?: number
  yMax?: number
  height?: string
  markers?: { index: number; color: string }[]
}) {
  const all = series.flatMap((s) => s.data)
  if (all.length === 0) return <p className="py-10 text-center text-sm text-muted-foreground">No chart data available.</p>
  const min = yMin ?? Math.min(...all)
  const max = yMax ?? Math.max(...all)
  const n = Math.max(...series.map((s) => s.data.length))
  const ticks = [max, (max + min) / 2, min]

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-0.5 text-right font-mono text-[10px] text-muted-foreground" aria-hidden="true">
          {ticks.map((t, i) => (
            <span key={i}>{fmt(t)}</span>
          ))}
        </div>
        <div className={cn('relative flex-1', height)}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <line key={f} x1="0" x2={W} y1={f * H} y2={f * H} stroke="var(--border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
            {markers?.map((m, i) => {
              const x = (m.index / Math.max(1, n - 1)) * W
              return <line key={i} x1={x} x2={x} y1={H - 6} y2={H} stroke={m.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            })}
            {series.map((s) => (
              <path
                key={s.name}
                d={buildPath(s.data, min, max, s.step)}
                fill="none"
                stroke={s.color}
                strokeWidth="1.75"
                strokeDasharray={s.dashed ? '5 4' : undefined}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="mt-1 flex justify-between pl-8 font-mono text-[10px] text-muted-foreground" aria-hidden="true">
        <span>0</span>
        <span>{xLabel}</span>
        <span>{xMax !== undefined ? fmt(xMax) : n}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded" style={{ background: s.color }} aria-hidden="true" />
            {s.name}
          </span>
        ))}
        {yLabel && <span className="ml-auto">y: {yLabel}</span>}
      </div>
    </div>
  )
}

export function BarList({ items, unit = '' }: { items: { label: string; value: number; color: string }[]; unit?: string }) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1)
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span>{it.label}</span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {it.value.toFixed(1)}
              {unit}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${(Math.abs(it.value) / max) * 100}%`, background: it.color }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ChartCard({
  title,
  label,
  description,
  children,
}: {
  title: string
  label: DataLabel
  description?: string
  children: ReactNode
}) {
  return (
    <figure className="flex h-full flex-col rounded-lg border border-border bg-card p-5">
      <figcaption className="mb-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <DataBadge label={label} />
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </figcaption>
      <div className="flex-1">{children}</div>
    </figure>
  )
}
