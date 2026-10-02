import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = {
  primary: 'bg-primary text-primary-foreground',
  info: 'bg-info text-white dark:text-[#02101f]',
  warn: 'bg-warn text-white dark:text-[#1f0d02]',
  teal: 'bg-teal text-white dark:text-[#021412]',
} as const

export type Tone = keyof typeof TONES

export function MetricCard({
  icon: Icon,
  title,
  description,
  value,
  tone = 'primary',
  className,
}: {
  icon: LucideIcon
  title: string
  description?: string
  value?: string
  tone?: Tone
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-border bg-card p-4', className)}>
      <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-full', TONES[tone])}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        {value !== undefined ? (
          <>
            <p className="font-mono text-lg font-semibold tabular-nums leading-tight">{value}</p>
            <p className="truncate text-xs text-muted-foreground">{title}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold leading-tight">{title}</p>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </>
        )}
      </div>
    </div>
  )
}
