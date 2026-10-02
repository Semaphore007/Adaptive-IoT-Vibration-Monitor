import Image from 'next/image'
import { ArrowRight, BookOpen, Code2 } from 'lucide-react'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { GithubIcon } from '@/components/brand-icons'
import { MetricCard } from '@/components/metric-card'
import { Pipeline } from '@/components/pipeline'
import { LinkButton, Section, SectionHeading } from '@/components/primitives'
import { TypingCode } from '@/components/typing-code'
import { TypewriterHeading } from '@/components/typewriter-heading'
import { LINKS, PROJECT } from '@/lib/constants'
import { HOME_FEATURES, TYPING_DEMO_CODE, WORKFLOW_STEPS } from '@/lib/project-data'

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-circuit pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              Research Project
            </span>
            <TypewriterHeading />
            <p className="mt-4 text-lg font-medium text-foreground/80">{PROJECT.subtitle}</p>
            {/* Tech chip badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              {['ESP32', 'MPU6050', 'MQTT', 'Edge Intelligence', 'INA219'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              An energy-aware adaptive IoT sensing framework that dynamically adjusts sensing, communication and
              edge-processing behaviour according to vibration conditions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/simulation" variant="primary">
                Explore Simulation <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/implementation" icon={<Code2 className="size-4" aria-hidden="true" />}>
                View Implementation
              </LinkButton>
              <LinkButton href="/manual" icon={<BookOpen className="size-4" aria-hidden="true" />}>
                Read Manual
              </LinkButton>
              <LinkButton href={LINKS.repo} icon={<GithubIcon />}>
                GitHub Repository
              </LinkButton>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" aria-hidden="true" />
            <Image
              src="/images/hero-esp32.png"
              alt="ESP32 board wired to MPU6050 accelerometer with vibration waveform and Wi-Fi connectivity"
              width={1408}
              height={768}
              priority
              className="relative w-full rounded-2xl border border-border shadow-xl"
            />
          </div>
        </div>
        {/* Metric feature cards */}
        <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {HOME_FEATURES.map((f) => (
              <li key={f.title}>
                <MetricCard icon={f.icon} title={f.title} description={f.description} tone={f.tone} className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Problem → Approach → Evaluation ── */}
      <Section>
        <SectionHeading
          eyebrow="Research Context"
          title="Problem → Approach → Evaluation"
          description="The three pillars that define this project."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              label: 'Problem',
              borderCls: 'border-destructive/30',
              bgCls: 'bg-destructive/5',
              title: 'Fixed-rate sensing overhead',
              body: 'Fixed-rate IoT sensing systems continue collecting and transmitting data even when the monitored environment is stable, leading to unnecessary energy consumption and bandwidth usage.',
            },
            {
              label: 'Approach',
              borderCls: 'border-primary/30',
              bgCls: 'bg-primary/5',
              title: 'Adaptive condition-aware sensing',
              body: 'Adaptive sensing dynamically changes sampling rate, transmission schedule and edge-processing frequency according to vibration conditions — saving resources when stable while remaining responsive to abnormal events.',
            },
            {
              label: 'Evaluation',
              borderCls: 'border-info/30',
              bgCls: 'bg-info/5',
              title: 'Baseline comparison',
              body: 'Compare fixed-rate and adaptive operation under equivalent conditions using energy, packets, bandwidth, detection accuracy and latency. Quantitative results require physical hardware experiments.',
            },
          ].map((c) => (
            <div key={c.label} className={`rounded-lg border p-5 ${c.borderCls} ${c.bgCls}`}>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.label}
              </p>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Workflow Pipeline ── */}
      <Section className="bg-card/60">
        <SectionHeading
          eyebrow="Workflow"
          title="From physical vibration to evaluated result"
          description="Each stage can be inspected in the implementation guide and exercised in the browser simulation."
        />
        <Pipeline steps={WORKFLOW_STEPS} />
      </Section>

      {/* ── Typing Code Demo ── */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Firmware"
              title="A small loop with adaptive decisions"
              description="The ESP32 reads vibration, classifies the current condition and adjusts how often it samples and publishes over MQTT. Full annotated code lives in the implementation guide."
            />
            <LinkButton href="/implementation" variant="ghost" className="-ml-4">
              Step-by-step guide <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
          <TypingCode code={TYPING_DEMO_CODE} language="C++ (Arduino)" />
        </div>
      </Section>

      {/* ── Architecture Preview ── */}
      <Section className="bg-card/60">
        <SectionHeading
          eyebrow="Architecture"
          title="Three layers, one feedback loop"
          action={<LinkButton href="/architecture">Full architecture</LinkButton>}
        />
        <ArchitectureFlow compact />
      </Section>

      {/* ── Research question CTA ── */}
      <Section className="pt-0">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10">
          <div className="bg-circuit pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Research question</h2>
              <p className="mt-2 max-w-2xl text-pretty italic opacity-90">&ldquo;{PROJECT.researchQuestion}&rdquo;</p>
            </div>
            <LinkButton href="/experiments" className="border-transparent bg-background text-foreground hover:bg-background/90">
              See experiment design <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  )
}
