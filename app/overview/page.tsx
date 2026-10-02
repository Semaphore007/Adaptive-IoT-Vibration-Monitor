import type { Metadata } from 'next'
import { BadgeCheck, Lightbulb, ListChecks, MessageCircleQuestion, Sigma, TriangleAlert, Workflow, Layers, CheckCircle2 } from 'lucide-react'
import { ComparisonTable } from '@/components/comparison-table'
import { Pipeline } from '@/components/pipeline'
import { Card, PageHeader, Section, SectionHeading, Notice, DataBadge } from '@/components/primitives'
import { PROJECT } from '@/lib/constants'
import { RESEARCH_METRICS, WORKFLOW_STEPS, SAMPLING_STRATEGIES } from '@/lib/project-data'

export const metadata: Metadata = { title: 'Project Overview' }

const PILLARS = [
  { icon: ListChecks, title: 'Objectives', text: 'Develop adaptive sensing on a low-cost node with edge intelligence and evaluate it against a fixed-rate baseline.' },
  { icon: Workflow, title: 'Approach', text: 'Adaptive sampling, condition-aware transmission and adaptive edge processing on ESP32 + MQTT.' },
  { icon: Sigma, title: 'Evaluation', text: 'Energy, packets, bandwidth, detection accuracy, latency and battery lifetime under equivalent conditions.' },
  { icon: BadgeCheck, title: 'Contribution', text: 'A practical, reproducible low-cost IoT setup with an implementation guide and simulation.' },
]

const COMPONENTS = [
  { name: '1. Physical Layer', desc: 'Vibration source (motor) and MPU6050 accelerometer capturing environmental data.' },
  { name: '2. Edge Node Hardware', desc: 'ESP32 microcontroller processing data locally, powered via INA219 for energy tracking.' },
  { name: '3. Sampling Firmware', desc: 'C++ logic implementing fixed and adaptive sampling algorithms directly on the MCU.' },
  { name: '4. Network Subsystem', desc: 'MQTT broker over Wi-Fi handling condition-aware message transmission.' },
  { name: '5. Edge Processing', desc: 'Python scripts on a local machine performing anomaly detection and signal reconstruction.' },
  { name: '6. Evaluation Framework', desc: 'Data logging, latency tracking, and metric calculation for baseline comparisons.' },
]

export default function OverviewPage() {
  return (
    <>
      <PageHeader title="Project Overview" tags={['Problem', 'Objectives', 'Workflow', 'Metrics', 'Contributions']} />
      
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <details className="group rounded-lg bg-primary text-primary-foreground">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-6">
              <TriangleAlert className="size-5" aria-hidden="true" />
              <h2 className="text-lg font-bold">Problem Statement</h2>
              <span className="ml-auto rounded-full border border-primary-foreground/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                Read
              </span>
            </summary>
            <p className="border-t border-primary-foreground/20 px-6 py-4 leading-relaxed opacity-95">
              Conventional IoT sensing systems often collect and transmit data at a fixed rate, even when the
              environment is stable, leading to unnecessary sensing, communication and energy consumption.
            </p>
          </details>
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 text-primary">
              <MessageCircleQuestion className="size-5" aria-hidden="true" />
              <h2 className="text-lg font-bold text-foreground">Research Question</h2>
            </div>
            <p className="mt-3 text-lg italic leading-relaxed font-semibold">&ldquo;{PROJECT.researchQuestion}&rdquo;</p>
          </Card>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <li key={p.title}>
              <Card className="h-full p-5">
                <p.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Architecture" title="System Components" description="The 6 dependency layers forming the end-to-end architecture." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((comp) => (
            <Card key={comp.name} className="p-5">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Layers className="size-5" />
                <h3 className="font-semibold text-foreground">{comp.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{comp.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Pipeline" title="Research Workflow" description="The end-to-end data pipeline from physical event to experimental evaluation." />
        <Pipeline steps={WORKFLOW_STEPS} />
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Methodology" title="Three Sampling Strategies" description="The core variables tested in this research to answer the research question." />
        <div className="grid gap-6 lg:grid-cols-3">
          {SAMPLING_STRATEGIES.map((strategy) => (
            <Card key={strategy.id} className={`p-6 border-t-4 ${strategy.color.split(' ')[0]} overflow-hidden relative`}>
              <div className={`absolute top-0 right-0 p-4 opacity-10 ${strategy.color.split(' ')[1]}`}>
                <strategy.icon className="size-24" />
              </div>
              <div className="relative z-10">
                <DataBadge label={strategy.label} value={strategy.adapts ? 'Adaptive' : 'Fixed'} />
                <h3 className="text-xl font-bold mt-4">{strategy.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{strategy.description}</p>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sampling Rate</span>
                  <p className="mt-1 font-mono text-sm">{strategy.rate}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Comparison" title="Fixed-rate vs adaptive sensing" description="Qualitative design comparison. Quantitative differences are to be measured in the experiments." />
        <ComparisonTable
          caption="Fixed-rate baseline compared with the adaptive approach"
          headers={['Aspect', 'Fixed-rate baseline', 'Adaptive approach']}
          rows={[
            ['Sampling', 'Constant interval', 'Interval adjusted to vibration level'],
            ['Transmission', 'Every N ms', 'Batched when stable, immediate when abnormal'],
            ['Edge processing', 'Constant frequency', 'Scaled with condition'],
            ['Energy', 'Independent of environment', 'Expected to drop in stable periods (to be measured)'],
            ['Detection risk', 'Reference', 'Must be verified against baseline'],
          ]}
        />
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Metrics" title="What is measured and why" description="Comprehensive research metrics with formulas." />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_METRICS.map((m) => (
            <li key={m.name}>
              <Card className="h-full p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                    <m.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-semibold">{m.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{m.definition}</p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Why it matters</dt>
                    <dd className="text-muted-foreground">{m.why}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How measured</dt>
                    <dd className="text-muted-foreground">{m.how}</dd>
                  </div>
                </dl>
                {m.formula && <p className="mt-3 rounded bg-muted px-2 py-1.5 font-mono text-xs">{m.formula}</p>}
              </Card>
            </li>
          ))}
        </ul>
        <Notice className="mt-6">
          <Lightbulb className="size-4 text-primary" />
          <span>Energy and battery comparisons are only meaningful under equivalent experiment conditions and repeated runs.</span>
        </Notice>
      </Section>

      <Section>
        <SectionHeading eyebrow="Outcomes" title="Expected Contribution" />
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Energy Efficiency Blueprint</h4>
                <p className="text-sm text-muted-foreground mt-1">A quantifiable demonstration of how much energy can be saved in IoT nodes using condition-aware sampling, backed by hardware measurements.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Bandwidth Optimization</h4>
                <p className="text-sm text-muted-foreground mt-1">Evidence of reduced network congestion through adaptive transmission, crucial for scalable IoT deployments.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Reproducible Methodology</h4>
                <p className="text-sm text-muted-foreground mt-1">A complete, open-source pipeline from physical sensing to edge processing that other researchers can adapt.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="size-5 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold">Algorithm Evaluation</h4>
                <p className="text-sm text-muted-foreground mt-1">Practical validation of DSRA-PMLO applied to real-world edge hardware, showing the trade-off between reconstruction error and sampling reduction.</p>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </>
  )
}
