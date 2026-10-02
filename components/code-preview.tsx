import type { ReactNode } from 'react'
import { tokenizeLine, TOKEN_CLASS } from '@/lib/highlight'
import { CopyButton } from './copy-button'

export function HighlightedLines({ code, caret }: { code: string; caret?: boolean }) {
  const lines = code.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="flex min-w-0">
          <span className="shrink-0 select-none pr-4 text-right text-code-foreground/50">{i + 1}</span>
          <span className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {tokenizeLine(line).map((tok, j) => (
              <span key={j} className={TOKEN_CLASS[tok.kind]}>
                {tok.text}
              </span>
            ))}
            {caret && i === lines.length - 1 && (
              <span className="caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] bg-primary" aria-hidden="true" />
            )}
          </span>
        </div>
      ))}
    </>
  )
}

export function CodeFrame({
  title,
  language,
  actions,
  children,
  label,
}: {
  title: string
  language: string
  actions?: ReactNode
  children: ReactNode
  label?: string
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-code text-code-foreground">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-[#f87171]/80" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]/80" />
            <span className="size-2.5 rounded-full bg-[#34d399]/80" />
          </span>
          <span className="font-mono text-xs text-code-foreground/80">{title}</span>
          <span className="rounded bg-background/50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-code-foreground/80">{language}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">{actions}</div>
      </figcaption>
      {label && <p className="sr-only">{label}</p>}
      {children}
    </figure>
  )
}

export function CodePreview({ code, language, title = 'snippet' }: { code: string; language: string; title?: string }) {
  return (
    <CodeFrame title={title} language={language} actions={<CopyButton text={code} />}>
      <pre className="overflow-x-hidden p-4 font-mono text-[13px] leading-6">
        <code className="block">
          <HighlightedLines code={code} />
        </code>
      </pre>
    </CodeFrame>
  )
}
