import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, BookOpen, CircuitBoard, Code2 } from 'lucide-react'
import { GithubIcon, LinkedinIcon, TelegramIcon } from '@/components/brand-icons'
import { Card, LinkButton, PageHeader, Section, SectionHeading } from '@/components/primitives'
import { LINKS, PROJECT, PROJECT_MANUAL_URL } from '@/lib/constants'

export const metadata: Metadata = { title: 'Contact' }

const CHANNELS = [
  { icon: GithubIcon, label: 'GitHub', handle: '@Semaphore007', href: LINKS.github, description: 'Personal profile and open-source work' },
  { icon: LinkedinIcon, label: 'LinkedIn', handle: 'Siddharth Gautam', href: LINKS.linkedin, description: 'Professional profile' },
  { icon: TelegramIcon, label: 'Telegram', handle: '@TheOutlier_2003', href: LINKS.telegram, description: 'Direct messaging' },
  { icon: GithubIcon, label: 'Project Repository', handle: PROJECT.shortName, href: LINKS.repo, description: 'Source code and implementation files' },
]

const PROJECT_LINKS = [
  { label: 'Implementation Manual (PDF)', icon: BookOpen, href: PROJECT_MANUAL_URL },
  { label: 'Project Repository', icon: Code2, href: LINKS.repo },
  { label: 'Wokwi Simulator', icon: CircuitBoard, href: LINKS.wokwiEsp32 },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact / Author" tags={['Get in Touch', 'Connect']} />
      <Section>
        {/* Author card */}
        <Card className="flex flex-col items-center gap-8 p-8 md:flex-row md:items-start">
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
            <Image
              src="/images/siddharth-gautam.png"
              alt="Portrait of Siddharth Gautam"
              width={220}
              height={220}
              className="relative size-44 rounded-full border-4 border-primary/30 object-cover md:size-52"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">{PROJECT.author}</h2>
            <p className="mt-1 font-semibold text-primary">CSE Student</p>
            <p className="text-muted-foreground">IoT · Edge Computing · Software Engineering</p>
            <details className="group mt-4 max-w-xl rounded-lg border border-border bg-muted/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-left text-sm font-medium text-foreground">
                Project brief
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground group-open:text-primary">
                  Open
                </span>
              </summary>
              <div className="border-t border-border p-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Author of the {PROJECT.shortName} research project — an energy-aware adaptive IoT sensing implementation
                  with a browser simulation portal, interactive experiment dashboard and comprehensive implementation manual.
                  Feel free to reach out about the implementation, experiments or collaboration.
                </p>
                <p className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-xs text-amber-700 dark:text-amber-200">
                  Note: For implementation questions, experimental design discussions or collaboration opportunities, please use the channels below.
                </p>
              </div>
            </details>
            <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              {PROJECT_LINKS.map((l) => (
                <LinkButton key={l.href} href={l.href} icon={<l.icon className="size-4" aria-hidden="true" />}>
                  {l.label}
                </LinkButton>
              ))}
            </div>
          </div>
        </Card>

        {/* Contact channels */}
        <SectionHeading eyebrow="Connect" title="Find me on" className="mt-16" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <c.icon className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.handle}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  Open <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
