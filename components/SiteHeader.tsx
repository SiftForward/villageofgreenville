'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/ballot', label: 'Your Ballot' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/who-represents', label: 'Who Represents' },
  { href: '/public-records', label: 'Public Records' },
  { href: '/growth-development', label: 'Growth & Dev' },
  { href: '/source-health', label: 'Source Health' },
  { href: '/what-changed', label: 'What Changed?' },
  { href: '/about', label: 'About' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-navy sticky top-0 z-40 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark */}
          <Link href="/" className="no-underline group flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base font-semibold text-warm-white group-hover:text-civic-green-muted transition-colors tracking-tight">
                VillageOfGreenville
                <span className="text-civic-green-muted">.com</span>
              </span>
              <span className="font-sans text-[0.55rem] font-bold tracking-[0.18em] uppercase text-navy-muted mt-0.5">
                The Community Record
              </span>
            </div>
          </Link>

          {/* Desktop nav — xl breakpoint to avoid overflow with 8 items */}
          <nav className="hidden xl:flex items-center gap-0.5" aria-label="Primary navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    no-underline px-2.5 py-1.5 rounded font-sans text-[0.8rem] font-medium transition-colors whitespace-nowrap
                    ${
                      isActive
                        ? 'text-civic-green-muted bg-white/10'
                        : 'text-warm-border hover:text-warm-white hover:bg-white/10'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="xl:hidden text-warm-border hover:text-warm-white transition-colors p-2 rounded"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="xl:hidden border-t border-navy-light pb-4 pt-2 grid grid-cols-2 gap-0.5"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    no-underline block px-3 py-2.5 font-sans text-sm font-medium rounded transition-colors
                    ${
                      isActive
                        ? 'text-civic-green-muted bg-white/10'
                        : 'text-warm-border hover:text-warm-white hover:bg-white/10'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
