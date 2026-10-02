import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WaveLogo } from './brand-icons'

type Variant = 'primary' | 'outline' | 'ghost'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/20',
  outline: 'border border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent',
  ghost: 'text-primary hover:bg-accent',
}

export function LinkButton({
  href,
  children,
  variant = 'outline',
  icon,
  className,
}: {
  href: string
  children: ReactNode
  variant?: Variant
  icon?: ReactNode
  className?: string
}) {
  const external = /^https?:\/\//.test(href)
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
    VARIANTS[variant],
    className,
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {icon}
        {children}
        <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
        <span className="sr-only">(opens in new tab)</span>
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {icon}
      {children}
    </Link>
  )
}

export function PageHeader({ title, description, tags }: { title: string; description?: string; tags?: string[] }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div className="bg-circuit pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-70 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl items-start gap-4 px-4 py-10 sm:px-6 md:py-14">
        <span className="mt-1 hidden size-11 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-secondary text-primary sm:inline-flex">
          <WaveLogo className="size-6" />
        </span>
        <div className="min-w-0">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">{title}</h1>
          {tags && (
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
              {tags.map((t, i) => (
                <span key={t} className="flex items-center gap-2">
                  {i > 0 && <span className="text-border" aria-hidden="true">|</span>}
                  {t}
                </span>
              ))}
            </p>
          )}
          {description && <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{description}</p>}
        </div>
      </div>
    </section>
  )
}

export function Section({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 md:py-16', className)}>
      {children}
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-3xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h2 className="mt-1 text-balance text-2xl font-bold md:text-3xl">{title}</h2>
        {description && <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md hover:shadow-primary/5', className)}>{children}</div>
}

export type DataLabel = 'DEMO DATA' | 'REPLAY DATA' | 'EXPERIMENTAL DATA' | 'CONCEPTUAL SIMULATION' | 'SIMULATION OUTPUT'

const BADGE_TONE: Record<DataLabel, string> = {
  'DEMO DATA': 'border-info/40 bg-info/10 text-info',
  'REPLAY DATA': 'border-teal/40 bg-teal/10 text-teal',
  'EXPERIMENTAL DATA': 'border-primary/40 bg-primary/10 text-primary',
  'CONCEPTUAL SIMULATION': 'border-warn/40 bg-warn/10 text-warn',
  'SIMULATION OUTPUT': 'border-info/40 bg-info/10 text-info',
}

export function DataBadge({ label }: { label: DataLabel }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider', BADGE_TONE[label])}>
      {label}
    </span>
  )
}

export function Notice({ children, tone = 'info', className }: { children: ReactNode; tone?: 'info' | 'warn'; className?: string }) {
  return (
    <details
      className={cn(
        'group rounded-md border text-sm leading-relaxed transition-colors',
        tone === 'warn'
          ? 'border-warn/30 bg-warn/5 text-foreground'
          : 'border-info/30 bg-info/5 text-foreground',
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-medium text-foreground marker:content-none hover:opacity-90">
        <span className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full border border-current/40 bg-background/40 text-[10px] font-bold uppercase tracking-wide">
            {tone === 'warn' ? '!' : 'i'}
          </span>
          <span>{tone === 'warn' ? 'Warning' : 'Note'}</span>
        </span>
        <span className="rounded-full border border-current/30 bg-background/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground group-open:text-foreground">
          Read
        </span>
      </summary>
      <div className="border-t border-current/10 px-4 pb-4 pt-3 text-muted-foreground [&_p:last-child]:mb-0">
        {children}
      </div>
    </details>
  )
}
