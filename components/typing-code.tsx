'use client'

import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CodeFrame, HighlightedLines } from './code-preview'
import { CopyButton } from './copy-button'

const SPEEDS = { Slow: 70, Normal: 30, Fast: 10 } as const
type Speed = keyof typeof SPEEDS

export function TypingCode({ code, language, title = 'main.ino' }: { code: string; language: string; title?: string }) {
  const [count, setCount] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<Speed>('Normal')
  const done = count >= code.length

  useEffect(() => {
    if (!playing || done) return
    const id = setTimeout(() => setCount((c) => Math.min(code.length, c + 1)), SPEEDS[speed])
    return () => clearTimeout(id)
  }, [playing, done, count, speed, code.length])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setCount(code.length)
  }, [code.length])

  const ctrl = 'inline-flex items-center gap-1 rounded border border-border bg-background/60 px-2 py-1 text-xs text-foreground hover:bg-muted'

  return (
    <CodeFrame
      title={title}
      language={language}
      label="Animated typing demonstration of firmware code."
      actions={
        <>
          <button type="button" className={ctrl} onClick={() => (done ? (setCount(0), setPlaying(true)) : setPlaying((p) => !p))} aria-label={playing && !done ? 'Pause typing' : 'Play typing'}>
            {playing && !done ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
            {playing && !done ? 'Pause' : 'Play'}
          </button>
          <button type="button" className={ctrl} onClick={() => { setCount(0); setPlaying(true) }} aria-label="Restart typing">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restart
          </button>
          <label className="sr-only" htmlFor="typing-speed">Typing speed</label>
          <select
            id="typing-speed"
            value={speed}
            onChange={(e) => setSpeed(e.target.value as Speed)}
            className="rounded border border-border bg-background/60 px-1.5 py-1 text-xs text-foreground"
          >
            {Object.keys(SPEEDS).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <CopyButton text={code} />
        </>
      }
    >
      <pre className="overflow-x-hidden p-4 font-mono text-[13px] leading-6" aria-hidden="true">
        <code className="block">
          <HighlightedLines code={code.slice(0, count)} caret />
        </code>
      </pre>
    </CodeFrame>
  )
}
