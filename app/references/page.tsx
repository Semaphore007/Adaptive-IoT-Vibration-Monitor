import type { Metadata } from 'next'
import { PageHeader, Section } from '@/components/primitives'
import { ReferenceCard } from '@/components/reference-card'
import { REFERENCE_GROUPS } from '@/lib/project-data'

export const metadata: Metadata = { title: 'References & Resources' }

export default function ReferencesPage() {
  return (
    <>
      <PageHeader title="References & Resources" tags={['Official Documentation', 'Tools', 'Research Software']} />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {REFERENCE_GROUPS.map((g) => (
            <section key={g.group} aria-labelledby={`ref-${g.group}`}>
              <h2 id={`ref-${g.group}`} className="mb-3 flex items-center gap-2 font-semibold">
                <g.icon className="size-5 text-primary" aria-hidden="true" />
                {g.group}
              </h2>
              <ul className="space-y-3">
                {g.items.map((r) => (
                  <li key={r.url}>
                    <ReferenceCard item={r} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Section>
    </>
  )
}
