import { ExternalLink } from 'lucide-react'
import type { HardwareItem, Requirement } from '@/lib/project-data'
import { cn } from '@/lib/utils'

const REQ_STYLE: Record<Requirement, string> = {
  Required: 'bg-primary text-primary-foreground',
  Recommended: 'bg-info/15 text-info border border-info/30',
  Optional: 'bg-muted text-muted-foreground border border-border',
}

export function HardwareCard({ item }: { item: HardwareItem }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-3">
        <span className="bg-grid inline-flex size-14 items-center justify-center rounded-md border border-border bg-secondary text-primary">
          <item.icon className="size-7" aria-hidden="true" />
        </span>
        <span className={cn('rounded px-2 py-0.5 text-[11px] font-semibold', REQ_STYLE[item.requirement])}>{item.requirement}</span>
      </div>
      <h3 className="mt-4 font-semibold">{item.name}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">{item.role}</p>
      {item.docUrl && (
        <a
          href={item.docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          {item.docLabel ?? 'Documentation'}
          <ExternalLink className="size-3" aria-hidden="true" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      )}
    </article>
  )
}
