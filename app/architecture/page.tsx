import type { Metadata } from 'next'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { ComparisonTable } from '@/components/comparison-table'
import { Card, PageHeader, Section, SectionHeading } from '@/components/primitives'

export const metadata: Metadata = { title: 'System Architecture' }

const LOOP = [
  { n: 1, title: 'Sense', text: 'MPU6050 acceleration is read at the current sampling interval.' },
  { n: 2, title: 'Classify', text: 'A vibration level (e.g. RMS over a short window) is compared to thresholds with hysteresis.' },
  { n: 3, title: 'Adapt', text: 'Sampling interval, transmission policy and processing rate are updated for the state.' },
  { n: 4, title: 'Publish', text: 'Data is published over MQTT — batched when stable, immediately when abnormal.' },
  { n: 5, title: 'Detect', text: 'The edge computer runs detection / reconstruction and logs metrics for evaluation.' },
]

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader title="System Architecture" tags={['Device Layer', 'Communication Layer', 'Edge Intelligence Layer']} />
      <Section>
        <ArchitectureFlow />
      </Section>
      <Section className="bg-card/60">
        <SectionHeading eyebrow="Control loop" title="How the layers interact" />
        <ol className="grid gap-4 md:grid-cols-5">
          {LOOP.map((s) => (
            <li key={s.n}>
              <Card className="h-full p-5">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">{s.n}</span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>
      <Section>
        <SectionHeading eyebrow="States" title="Condition-dependent behaviour" description="Illustrative policy used by the simulation. Real thresholds are calibrated per setup." />
        <ComparisonTable
          caption="Behaviour per vibration state"
          headers={['State', 'Sampling', 'Transmission', 'Edge processing']}
          rows={[
            ['Stable', 'Long interval (low rate)', 'Batched / periodic summary', 'Reduced frequency'],
            ['Moderate', 'Medium interval', 'Regular interval', 'Normal frequency'],
            ['Abnormal', 'Short interval (high rate)', 'Immediate publish', 'Full frequency + alert'],
          ]}
        />
      </Section>

      {/* ── Edge Intelligence vs Cloud-first ── */}
      <Section className="bg-card/60">
        <SectionHeading
          eyebrow="Design Decision"
          title="Edge intelligence vs cloud-first"
          description="Why processing is placed at the edge rather than centralised in the cloud."
        />
        <ComparisonTable
          caption="Edge vs cloud processing comparison"
          headers={['Metric', 'Cloud-first approach', 'Edge-first approach (this project)']}
          rows={[
            ['Latency', 'Round-trip to remote server (100s ms – seconds)', 'Local processing (single-digit ms)'],
            ['Bandwidth', 'All raw samples must be transmitted continuously', 'Only selected / aggregated data is sent'],
            ['Energy', 'Radio active for every sample regardless of condition', 'Radio reduced during stable periods'],
            ['Connectivity', 'Continuous internet connection required', 'Works over local Wi-Fi or LAN broker'],
            ['Response time to events', 'Delayed by network round-trip', 'Near-immediate local detection'],
            ['Complexity', 'Cloud infrastructure, accounts, APIs', 'Edge computer (laptop/Pi), local broker'],
          ]}
        />
        <Card className="mt-6 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Future live integration:</strong> A WebSocket or HTTP bridge between the local MQTT broker and a web dashboard would enable live data visualisation without a full cloud backend. For now, this website operates in DEMO or REPLAY mode using browser-generated or uploaded CSV data.
          </p>
        </Card>
      </Section>
    </>
  )
}
