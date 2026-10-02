'use client'

import { FileUp, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EXPECTED_COLUMNS, parseCsv, type CsvColumn, type ParsedCsv } from '@/lib/csv'
import { ChartCard, LineChart } from './line-chart'

const CHARTS: { col: CsvColumn; title: string; color: string }[] = [
  { col: 'vibration', title: 'Vibration', color: 'var(--chart-1)' },
  { col: 'sampling_rate', title: 'Sampling rate', color: 'var(--chart-3)' },
  { col: 'transmission_rate', title: 'Transmission rate', color: 'var(--chart-2)' },
  { col: 'packets_sent', title: 'Packets sent', color: 'var(--chart-2)' },
  { col: 'energy', title: 'Energy', color: 'var(--chart-4)' },
  { col: 'latency', title: 'Latency', color: 'var(--chart-4)' },
  { col: 'processing_rate', title: 'Processing rate', color: 'var(--chart-3)' },
  { col: 'detection', title: 'Detection', color: 'var(--destructive)' },
]

const MAX_POINTS = 600

function downsample(values: number[]) {
  if (values.length <= MAX_POINTS) return values
  const step = values.length / MAX_POINTS
  return Array.from({ length: MAX_POINTS }, (_, i) => values[Math.floor(i * step)])
}

export function ResultsDashboard() {
  const [data, setData] = useState<ParsedCsv | null>(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('File is larger than 10 MB. Please downsample before importing.')
      return
    }
    try {
      setData(parseCsv(await file.text()))
      setFileName(file.name)
      setError(null)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : 'Could not parse the file.')
    }
  }

  const stats = useMemo(() => {
    if (!data) return []
    return data.columns.map((c) => {
      const vals = data.rows.map((r) => r[c]).filter((v): v is number => v !== undefined)
      const mean = vals.reduce((s, v) => s + v, 0) / (vals.length || 1)
      return { col: c, n: vals.length, min: Math.min(...vals), max: Math.max(...vals), mean }
    })
  }, [data])

  const tMax = data?.rows[data.rows.length - 1]?.timestamp

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Import experimental CSV</h2>
            <p className="mt-1 text-sm text-muted-foreground">Parsed locally in your browser. Nothing is uploaded to a server.</p>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:brightness-110">
              <FileUp className="size-4" aria-hidden="true" />
              Choose CSV file
              <input type="file" accept=".csv,text/csv" onChange={onFile} className="sr-only" />
            </label>
            {data && (
              <button type="button" onClick={() => { setData(null); setFileName('') }} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm hover:bg-accent">
                <Trash2 className="size-4" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expected columns</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {EXPECTED_COLUMNS.map((c) => (
              <li key={c} className={`rounded border px-2 py-0.5 font-mono text-xs ${data?.columns.includes(c) ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                {c}
              </li>
            ))}
          </ul>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {data && (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            Loaded <span className="font-medium text-foreground">{fileName}</span>: {data.rows.length} rows
            {data.skipped > 0 && `, ${data.skipped} skipped`}
            {data.missing.length > 0 && `. Missing: ${data.missing.join(', ')}`}.
          </p>
        )}
      </div>

      {!data ? (
        <details className="rounded-lg border border-border bg-card">
          <summary className="cursor-pointer list-none rounded-lg px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent">
            No experimental data has been imported
          </summary>
          <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            Experimental results will appear here only after you load a CSV file from your own runs. Charts on this page are never pre-filled with invented results.
          </p>
        </details>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {CHARTS.filter((c) => data.columns.includes(c.col)).map((c) => (
              <ChartCard key={c.col} title={c.title} label="EXPERIMENTAL DATA" description={`Column: ${c.col}`}>
                <LineChart
                  xMax={tMax}
                  xLabel={data.columns.includes('timestamp') ? 'timestamp' : 'row'}
                  series={[{ name: c.col, color: c.color, data: downsample(data.rows.map((r) => r[c.col] ?? 0)), step: c.col === 'detection' }]}
                />
              </ChartCard>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="px-4 pt-4 text-left text-sm font-semibold">Column statistics (from imported data)</caption>
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  {['Column', 'Rows', 'Min', 'Mean', 'Max'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums">
                {stats.map((s) => (
                  <tr key={s.col} className="border-t border-border">
                    <th scope="row" className="px-4 py-2 text-left font-medium">{s.col}</th>
                    <td className="px-4 py-2">{s.n}</td>
                    <td className="px-4 py-2">{s.min.toFixed(3)}</td>
                    <td className="px-4 py-2">{s.mean.toFixed(3)}</td>
                    <td className="px-4 py-2">{s.max.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
