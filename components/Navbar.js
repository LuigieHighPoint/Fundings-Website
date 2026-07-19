import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLang } from './LangContext'

export default function Navbar() {
  const { lang, t, toggle } = useLang()
  const isEs = lang === 'es'
  const router = useRouter()
  const isHome = router.pathname === '/'
  const anchor = (id) => (isHome ? `#${id}` : `/#${id}`)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Announcement bar */}
      <div className="announce-bar">
        <div className="lang-toggle">
          <span className={`lang-label ${!isEs ? 'active' : 'inactive'}`} onClick={toggle}>EN</span>
          <div className={`lang-switch ${isEs ? 'es' : ''}`} onClick={toggle} />
          <span className={`lang-label ${isEs ? 'active' : 'inactive'}`} onClick={toggle}>ES</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={scrolled ? 'nav-scrolled' : ''}>
        <Link href="/" className="nav-logo">
          <span className="nl1">HIGH POINT</span>
          <span className="nl2">FUNDINGS</span>
        </Link>

        <ul className="nav-links">
          <li className="nav-dropdown">
            <a href={anchor('programs')} className="nav-dropdown-trigger">
              {t.navPrograms} <span className="nav-caret">▾</span>
            </a>
            <div className="nav-dropdown-panel">
              <div className="nav-dropdown-menu">
                {t.programs.map((p, i) => (
                  <Link key={i} href={`/loans/${p.slug}`}>{p.title}</Link>
                ))}
              </div>
            </div>
          </li>
          <li><Link href="/calculator">{t.navCalculator}</Link></li>
          <li><a href={anchor('how-it-works')}>{t.navHow}</a></li>
          <li><a href={anchor('why-us')}>{t.navWhy}</a></li>
          <li><a href={anchor('faq')}>{t.navFaq}</a></li>
        </ul>

        <div className="nav-right">
          <a href={anchor('get-quote')} className="nav-cta">{t.navCta}</a>
        </div>
      </nav>
    </>
  )
}
