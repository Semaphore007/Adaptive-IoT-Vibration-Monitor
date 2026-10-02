import type { Metadata } from 'next'
import { PageHeader, Section } from '@/components/primitives'
import { ResultsDashboard } from '@/components/results-dashboard'

export const metadata: Metadata = { title: 'Results' }

export default function ResultsPage() {
  return (
    <>
      <PageHeader title="Results" description="Visualise your own experimental CSV logs." tags={['CSV Import', 'Experimental Data', 'Statistics']} />
      <Section>
        <ResultsDashboard />
      </Section>
    </>
  )
}
