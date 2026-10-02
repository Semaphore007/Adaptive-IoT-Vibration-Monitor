import type { Metadata } from 'next'
import { CircuitBoard } from 'lucide-react'
import { ComparisonTable } from '@/components/comparison-table'
import { HardwareCard } from '@/components/hardware-card'
import { LinkButton, Notice, PageHeader, Section, SectionHeading } from '@/components/primitives'
import { LINKS } from '@/lib/constants'
import { HARDWARE, WIRING } from '@/lib/project-data'

export const metadata: Metadata = { title: 'Hardware & Setup' }

const SETUP = [
  'Install Arduino IDE (or ESP-IDF) and the ESP32 board package.',
  'Install libraries: Adafruit MPU6050, Adafruit INA219, PubSubClient.',
  'Wire MPU6050 and INA219 on the shared I²C bus (GPIO21/22).',
  'Drive the vibration motor through a transistor from a GPIO pin.',
  'Run a local MQTT broker (e.g. Mosquitto) on the edge computer.',
  'Flash the firmware, open the serial monitor, and verify sensor readings.',
]

export default function HardwarePage() {
  return (
    <>
      <PageHeader title="Hardware & Setup" tags={['Components', 'Wiring', 'Setup Guide']} />
      
      <Section>
        <SectionHeading eyebrow="Components" title="Bill of materials" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HARDWARE.map((h) => (
            <li key={h.name}>
              <HardwareCard item={h} />
            </li>
          ))}
        </ul>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading
          eyebrow="Wiring"
          title="Connection table"
          description="Default ESP32 Arduino I²C pins. Always verify against your specific breakout boards."
          action={
            <LinkButton href={LINKS.wokwiMpuExample} icon={<CircuitBoard className="size-4" aria-hidden="true" />}>
              Open Wokwi example
            </LinkButton>
          }
        />
        <ComparisonTable caption="Wiring between components" headers={['From', 'To', 'Note']} rows={WIRING.map((w) => [w.from, w.to, w.note])} />
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">INA219 Wiring</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The INA219 requires careful wiring as it sits in series with the power supply of the ESP32 node to measure its total energy consumption:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 space-y-1">
            <li>INA219 VIN+ → Supply positive (in series with node)</li>
            <li>INA219 VIN- → Node VCC</li>
            <li>INA219 SDA → ESP32 GPIO21 (shared I2C)</li>
            <li>INA219 SCL → ESP32 GPIO22 (shared I2C)</li>
          </ul>
          <Notice tone="warn">Never power a vibration motor directly from an ESP32 GPIO. Use a transistor/MOSFET driver and a flyback diode.</Notice>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Architecture" title="Circuit Diagram" />
        <pre className="overflow-hidden rounded-lg bg-muted p-4 font-mono text-xs leading-6 whitespace-pre-wrap text-foreground">
{`      Power Supply (5V/3.3V)
           │
           ├──► INA219 (VIN+)
           │       └──► (VIN-) ──► ESP32 (VIN/3V3)
           │                         │
           │                         ├──► I2C (GPIO21/22) ◄──► MPU6050
           │                         │                         (SDA/SCL)
           │                         ├──► I2C (GPIO21/22) ◄──► INA219
           │                         │                         (SDA/SCL)
           │                         │
           │                         └──► GPIO (PWM) ──► NPN Transistor
           │                                                │
           └────────────────────────────────────────────────┴──► DC Motor
                                                                 (Vibration)`}
        </pre>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Evaluation" title="Energy Measurement" />
        <p className="text-muted-foreground leading-relaxed">
          To validate the efficiency of the adaptive sampling protocol, energy is calculated by measuring the power consumption over time. The INA219 measures both bus voltage and current. The total energy <strong>E</strong> consumed is the integral of power over time: <strong>E = ∫P(t)dt</strong>.
        </p>
      </Section>

      <Section>
        <SectionHeading eyebrow="Experiment" title="Testing Vibration Conditions" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          To simulate real-world mechanical faults, a DC motor with an unbalanced weight can be used. By driving the motor at different speeds using PWM, various conditions are simulated:
        </p>
        <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
          <li><strong>Normal Condition:</strong> Motor running at a steady baseline speed with a balanced load.</li>
          <li><strong>Abnormal Condition (Fault):</strong> Motor running at high speed or with a broken rotor bar (simulated via unbalanced weight), causing excessive vibration.</li>
        </ul>
      </Section>

      <Section className="bg-card/60">
        <SectionHeading eyebrow="Setup" title="Quick Setup Checklist" />
        <ol className="grid gap-3 md:grid-cols-2">
          {SETUP.map((s, i) => (
            <li key={s} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-primary">{i + 1}</span>
              <span className="text-sm leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
