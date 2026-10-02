'use client'

import { useEffect, useState } from 'react'

const TITLE = 'Adaptive-IoT-Vibration-Monitor Simulation'
const PROJECT_NAME = 'Adaptive-IoT-Vibration-Monitor '
const VIBRATION_START = TITLE.indexOf('Vibration')
const VIBRATION_END = VIBRATION_START + 'Vibration'.length

export function TypewriterHeading() {
  const [characterCount, setCharacterCount] = useState(0)
  const [typing, setTyping] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      setCharacterCount(TITLE.length)
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    if (typing && characterCount === TITLE.length) {
      const timeout = setTimeout(() => setTyping(false), 1200)
      return () => clearTimeout(timeout)
    }

    if (!typing && characterCount === 0) {
      const timeout = setTimeout(() => setTyping(true), 450)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(
      () => setCharacterCount((count) => count + (typing ? 1 : -1)),
      typing ? 75 : 38,
    )
    return () => clearTimeout(timeout)
  }, [characterCount, reducedMotion, typing])

  return (
    <h1
      aria-label={TITLE}
      className="mt-5 grid text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
    >
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {TITLE.slice(0, VIBRATION_START)}
        <span className="text-primary">{TITLE.slice(VIBRATION_START, VIBRATION_END)}</span>
        {TITLE.slice(VIBRATION_END, PROJECT_NAME.length)}
        <span className="text-primary">{TITLE.slice(PROJECT_NAME.length)}</span>
      </span>
      <span className="col-start-1 row-start-1" aria-hidden="true">
        {TITLE.slice(0, Math.min(characterCount, VIBRATION_START))}
        <span className="text-primary">
          {TITLE.slice(VIBRATION_START, Math.min(characterCount, VIBRATION_END))}
        </span>
        {TITLE.slice(VIBRATION_END, Math.min(characterCount, PROJECT_NAME.length))}
        <span className="text-primary">{TITLE.slice(PROJECT_NAME.length, characterCount)}</span>
        {!reducedMotion && <span className="caret ml-px inline-block h-[0.95em] translate-y-[0.08em] border-r-2 border-primary" />}
      </span>
    </h1>
  )
}
