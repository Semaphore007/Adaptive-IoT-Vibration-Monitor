import { ExternalLink } from 'lucide-react'
import type { Reference } from '@/lib/project-data'

export function ReferenceCard({ item }: { item: Reference }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div className="min-w-0">
        <p className="font-medium group-hover:text-primary">{item.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground/80">{item.url.replace(/^https?:\/\//, '')}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 rounded border border-primary/30 px-2 py-1 text-xs font-medium text-primary">
        Open
        <ExternalLink className="size-3" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </span>
    </a>
  )
}
