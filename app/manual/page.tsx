import type { Metadata } from 'next'
import { BookOpen, CircuitBoard, Download, ExternalLink, FileText, FolderOpen } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'
import { Card, LinkButton, Notice, PageHeader, Section, SectionHeading } from '@/components/primitives'
import { LINKS, PROJECT_MANUAL_DOWNLOAD_URL, PROJECT_MANUAL_PREVIEW_URL, PROJECT_MANUAL_URL } from '@/lib/constants'
import { MANUAL_CONTENTS } from '@/lib/project-data'

export const metadata: Metadata = { title: 'Manual' }

const QUICK_SECTIONS = [
  { n: 1, title: 'Project Overview', desc: 'Research context, problem statement, contribution' },
  { n: 2, title: 'Objectives', desc: 'Specific targets and scope of the study' },
  { n: 3, title: 'Architecture', desc: 'Three-layer system design and data flow' },
  { n: 4, title: 'Hardware', desc: 'Components, circuit, wiring, INA219 setup' },
  { n: 5, title: 'Software', desc: 'ESP32 firmware, libraries, edge scripts' },
  { n: 6, title: 'ESP32 Setup', desc: 'Toolchain, board config, serial logging' },
  { n: 7, title: 'Sensor Integration', desc: 'MPU6050 and INA219 initialisation' },
  { n: 8, title: 'Adaptive Sampling', desc: 'Threshold-based and DSRA-PMLO methods' },
  { n: 9, title: 'MQTT', desc: 'Broker, topics, payload format, Mosquitto' },
  { n: 10, title: 'Edge Processing', desc: 'Detection, reconstruction, logging' },
  { n: 11, title: 'Energy Measurement', desc: 'INA219 integration, E = ∫P(t)dt' },
  { n: 12, title: 'Experiments', desc: 'A–J experiment design and procedure' },
  { n: 13, title: 'Results', desc: 'CSV format, charts, statistical analysis' },
  { n: 14, title: 'Reproducibility', desc: 'Parameter table, setup, dataset usage' },
  { n: 15, title: 'Research Contribution', desc: 'Energy, accuracy, latency findings' },
]

export default function ManualPage() {
  return (
    <>
      <PageHeader title="Implementation Manual" tags={['Implementation Guide', 'PDF Viewer', 'Quick Access']} />

      {/* Top CTA */}
      <Section>
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* PDF preview iframe */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <iframe
              src={PROJECT_MANUAL_PREVIEW_URL}
              title="Adaptive-IoT-Vibration-Monitor implementation manual (PDF)"
              className="aspect-[3/4] w-full md:aspect-[4/3]"
              loading="lazy"
              allow="autoplay"
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Card className="overflow-hidden">
              <div className="space-y-2 p-4">
                <h2 className="font-semibold">Manual Actions</h2>
                <LinkButton href={PROJECT_MANUAL_URL} variant="primary" className="w-full" icon={<BookOpen className="size-4" aria-hidden="true" />}>
                  Open Manual (PDF)
                </LinkButton>
                <LinkButton href={PROJECT_MANUAL_DOWNLOAD_URL} className="w-full" icon={<Download className="size-4" aria-hidden="true" />}>
                  Download Manual
                </LinkButton>
                <LinkButton href={LINKS.repo} className="w-full" icon={<GithubIcon />}>
                  View GitHub Repository
                </LinkButton>
                <LinkButton href={LINKS.wokwiEsp32} className="w-full" icon={<CircuitBoard className="size-4" aria-hidden="true" />}>
                  Open Wokwi Simulator
                </LinkButton>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold">Project Info</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {[
                  ['Status', 'Active Research'],
                  ['Author', 'Siddharth Gautam'],
                  ['Domain', 'IoT / Edge Computing'],
                  ['Hardware', 'ESP32 + MPU6050 + INA219'],
                  ['Language', 'C++ (Arduino) + Python'],
                  ['Protocol', 'MQTT / Mosquitto'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </aside>
        </div>

        {/* Quick section navigator */}
        <SectionHeading eyebrow="Contents" title="Manual Sections" description="The manual covers all aspects from hardware setup to experimental analysis." />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_SECTIONS.map((s) => (
            <li key={s.n}>
              <div className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md hover:shadow-primary/5">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-primary">
                  {s.n}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Data files */}
      <Section className="bg-card/60">
        <SectionHeading
          eyebrow="Included Datasets"
          title="Real motor vibration data"
          description="The project ships with real motor vibration amplitude recordings used by the DSRA-PMLO algorithm. These are real measurements — not synthetic."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { file: 'motor_no_load.txt', label: 'Normal motor', tag: 'Baseline', desc: 'Motor running without load — normal vibration baseline.' },
            { file: 'motor_light_load_brb.txt', label: 'Fault condition', tag: 'Abnormal', desc: 'Motor with broken rotor bar fault under light load.' },
            { file: 'motor_no_load_brb.txt', label: 'No-load fault', tag: 'Abnormal', desc: 'Motor with broken rotor bar fault, no load.' },
            { file: 'downsampled_data_20000.txt', label: 'Reference dataset', tag: 'Reference', desc: '20,000-sample downsampled signal for DSRA-PMLO evaluation.' },
          ].map((d) => (
            <Card key={d.file} className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${d.tag === 'Baseline' ? 'border-primary/30 bg-primary/10 text-primary' : d.tag === 'Abnormal' ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-info/30 bg-info/10 text-info'}`}>
                  {d.tag}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold">{d.file}</p>
              <p className="mt-1 text-xs font-semibold text-foreground">{d.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.desc}</p>
            </Card>
          ))}
        </div>
        <Notice className="mt-4">
          These files are located at <code className="font-mono">src/dsra_pmlo/data/</code> in the repository. Upload them to the Results page CSV importer (after converting to CSV format) to visualise real experimental data.
        </Notice>
      </Section>

      {/* Reproducibility */}
      <Section>
        <SectionHeading
          eyebrow="Reproducibility"
          title="What you need to replicate this experiment"
          description="Every component needed to reproduce the complete experiment is documented."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Hardware',
              icon: CircuitBoard,
              items: ['ESP32 DevKit (or ESP32-S3)', 'MPU6050 accelerometer', 'INA219 current sensor', 'DC motor / vibration source', '18650 battery + holder', 'Breadboard + jumper wires'],
            },
            {
              title: 'ESP32 Firmware',
              icon: FolderOpen,
              items: ['Arduino IDE or PlatformIO', 'Adafruit MPU6050 library', 'Adafruit INA219 library', 'PubSubClient (MQTT)', 'WiFi library (built-in)'],
            },
            {
              title: 'Edge Software',
              icon: FileText,
              items: ['Python 3.8+', 'paho-mqtt', 'numpy, pandas, scipy', 'matplotlib', 'Mosquitto MQTT broker'],
            },
            {
              title: 'DSRA-PMLO',
              icon: ExternalLink,
              items: ['Clone from: github.com/Hatemgab/DSRA-PMLO-Adaptive-Sampling', 'Install requirements', 'Place motor data in src/dsra_pmlo/data/', 'Run use_case.py for parameter search'],
            },
          ].map((section) => (
            <Card key={section.title} className="p-5">
              <div className="flex items-center gap-2">
                <section.icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <ul className="mt-3 space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
    </>
  )
}
