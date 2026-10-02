import { cn } from '@/lib/utils'

/** Ordered flow of steps with subtle animated data pulses between them. */
export function Pipeline({ steps, className }: { steps: string[]; className?: string }) {
  return (
    <ol className={cn('flex flex-col gap-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-y-4', className)}>
      {steps.map((step, i) => (
        <li key={step} className="flex flex-col items-stretch lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 lg:py-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px] font-semibold text-primary">
              {i + 1}
            </span>
            <span className="text-sm font-medium">{step}</span>
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="relative mx-auto h-6 w-px bg-primary/30 lg:mx-1 lg:h-px lg:w-8">
              <span className="flow-dot-y absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary lg:hidden" />
              <span className="flow-dot-x absolute top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-primary lg:block" style={{ animationDelay: `${i * 0.25}s` }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
