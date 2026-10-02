import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { LINKS, PROJECT } from '@/lib/constants'
import { WaveLogo } from './brand-icons'

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/architecture', label: 'Architecture' },
  { href: '/implementation', label: 'Implementation' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/experiments', label: 'Experiments' },
  { href: '/manual', label: 'Manual' },
  { href: '/references', label: 'References' },
  { href: '/contact', label: 'Contact' },
]

const RESOURCES = [
  { href: LINKS.repo, label: 'GitHub' },
  { href: LINKS.wokwiEsp32, label: 'Wokwi' },
  { href: LINKS.espIdf, label: 'ESP-IDF' },
  { href: LINKS.dsra, label: 'DSRA-PMLO' },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <WaveLogo />
            </span>
            {PROJECT.shortName}
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{PROJECT.subtitle}</p>
        </div>
        <nav aria-label="Footer quick links">
          <h2 className="text-sm font-semibold">Quick Links</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer resources">
          <h2 className="text-sm font-semibold">Resources</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {RESOURCES.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary">
                  {l.label}
                  <ExternalLink className="size-3" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted-foreground sm:px-6">
          © 2026 Siddharth Gautam. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
