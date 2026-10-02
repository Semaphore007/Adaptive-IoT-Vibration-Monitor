'use client'

import { ArrowDownToLine, ArrowUpFromLine, CircleDot, Target } from 'lucide-react'
import { useState } from 'react'
import { IMPLEMENTATION_SECTIONS } from '@/lib/project-data'
import { cn } from '@/lib/utils'
import { CodePreview } from './code-preview'

export function ImplementationExplorer() {
  const [activeId, setActiveId] = useState(IMPLEMENTATION_SECTIONS[0].id)
  const [tab, setTab] = useState<'code' | 'explanation'>('code')
  const s = IMPLEMENTATION_SECTIONS.find((x) => x.id === activeId) ?? IMPLEMENTATION_SECTIONS[0]

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <nav aria-label="Implementation steps" className="lg:sticky lg:top-20 lg:self-start">
        <ol className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
          {IMPLEMENTATION_SECTIONS.map((x, i) => (
            <li key={x.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveId(x.id)}
                aria-current={x.id === activeId ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                  x.id === activeId ? 'bg-primary text-primary-foreground' : 'hover:bg-accent',
                )}
              >
                <span className={cn('inline-flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs', x.id === activeId ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground')}>
                  {i + 1}
                </span>
                <span className="whitespace-nowrap">{x.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <article className="min-w-0 space-y-5" aria-live="polite">
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-mono text-xs font-semibold text-primary">Section {s.number}</p>
          <h2 className="mt-1 text-2xl font-bold">{s.title}</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            {(
              [
                [Target, 'Purpose', s.purpose],
                [ArrowDownToLine, 'Inputs', s.inputs],
                [CircleDot, 'Process', s.process],
                [ArrowUpFromLine, 'Output', s.output],
              ] as const
            ).map(([Icon, k, v]) => (
              <div key={k} className="flex gap-3">
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold">{k}</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div role="tablist" aria-label="View" className="inline-flex rounded-md border border-border bg-card p-1">
          {(['code', 'explanation'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn('rounded px-4 py-1.5 text-sm font-medium capitalize', tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              {t === 'code' ? 'Code example' : 'Explanation'}
            </button>
          ))}
        </div>

        {tab === 'code' ? (
          <CodePreview code={s.code} language={s.language} title={s.id} />
        ) : (
          <div className="rounded-lg border border-border bg-card p-6">
            <ul className="space-y-3">
              {s.notes.map((n) => (
                <li key={n} className="flex gap-3 text-sm leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  )
}
