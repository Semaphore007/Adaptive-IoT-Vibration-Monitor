'use client'

import { TriangleAlert } from 'lucide-react'
import { useState } from 'react'

export function ProblemStatementCard({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setExpanded((value) => !value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setExpanded((value) => !value)
        }
      }}
      aria-expanded={expanded}
      className={[
        'cursor-pointer overflow-hidden rounded-lg border border-border transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary/40',
        expanded ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' : 'bg-card text-foreground',
      ].join(' ')}
    >
      <div className={[
        'flex items-center gap-2 transition-all duration-200',
        expanded ? 'px-5 py-5 sm:px-6' : 'px-4 py-3 sm:px-5',
      ].join(' ')}>
        <TriangleAlert className={expanded ? 'size-5 shrink-0' : 'size-4 shrink-0'} aria-hidden="true" />
        <h2 className="text-base font-bold sm:text-lg">Problem Statement</h2>
        <span className="ml-auto rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          {expanded ? 'Close' : 'Read'}
        </span>
      </div>

      {expanded && (
        <p className="border-t border-current/15 px-4 py-3 text-sm leading-relaxed opacity-95 sm:px-5 sm:py-4 sm:text-base">
          {text}
        </p>
      )}
    </div>
  )
}
