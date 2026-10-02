import type { Metadata } from 'next'
import { CircuitBoard, ExternalLink } from 'lucide-react'
import { DsraVisual } from '@/components/dsra-visual'
import { Card, LinkButton, PageHeader, Section, SectionHeading } from '@/components/primitives'
import { SimulationPanel } from '@/components/simulation-panel'
import { LINKS } from '@/lib/constants'

export const metadata: Metadata = { title: 'Interactive Simulation' }

const WOKWI_LINKS = [
  {
    title: 'Open ESP32 Simulation on Wokwi',
    url: LINKS.wokwiEsp32,
    description: 'Primary ESP32 simulator — flash and test firmware without hardware.',
    primary: true,
  },
  {
    title: 'MPU6050 ESP32 Example',
    url: LINKS.wokwiMpuExample,
    description: 'Pre-wired ESP32 + MPU6050 project in Wokwi.',
    primary: false,
  },
  {
    title: 'Wokwi ESP32 Documentation',
    url: LINKS.wokwiEsp32Docs,
    description: 'Official guide for simulating ESP32 projects in Wokwi.',
    primary: false,
  },
  {
    title: 'MPU6050 Wokwi Documentation',
    url: LINKS.wokwiMpuDocs,
    description: 'MPU6050 part reference for the Wokwi simulator.',
    primary: false,
  },
]

export default function SimulationPage() {
  return (
    <>
      <PageHeader title="Interactive Simulation" tags={['Real-time Visualization', 'Adaptive Sampling', 'Parameter Control']} />
      <Section>
        <div className="mb-6">
          <details className="rounded-lg border border-info/30 bg-info/5 text-foreground">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold hover:bg-info/10">
              About the simulation data
            </summary>
            <p className="border-t border-info/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
            This is an in-browser educational model. Values are generated (DEMO DATA) and illustrate the adaptive
            behaviour; they are not measurements from the physical prototype.
            </p>
          </details>
        </div>
        <SimulationPanel />
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Concept" title="Adaptive sample selection" description="Raise the tolerance to keep fewer samples and watch the reconstruction error grow." />
        <DsraVisual />
      </Section>

      {/* ── Open Hardware Simulator ── */}
      <Section>
        <SectionHeading
          eyebrow="Hardware Simulation"
          title="Open Hardware Simulator"
          description="Wokwi supports ESP32 firmware simulation and an MPU6050 virtual part. You can test I²C reads and MQTT (via simulated networking) before deploying to real hardware."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {WOKWI_LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-start gap-4 rounded-lg border p-5 transition-all hover:border-primary/50 hover:bg-accent ${l.primary ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}
            >
              <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <CircuitBoard className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug group-hover:text-primary">{l.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{l.description}</p>
              </div>
              <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
              <span className="sr-only">(opens in new tab)</span>
            </a>
          ))}
        </div>
        <Card className="mt-6 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Simulation note:</strong> Wokwi validates firmware logic and virtual hardware behaviour. Actual energy measurements (INA219 readings) and real MQTT broker connectivity require physical hardware. Use Wokwi to develop and debug firmware before deploying to a real ESP32.
          </p>
        </Card>
      </Section>
    </>
  )
}
