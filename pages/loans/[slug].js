import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar'
import { CTA, Footer } from '../../components/CTAFooter'
import { useLang } from '../../components/LangContext'
import { useReveal } from '../../components/useReveal'

export default function LoanDetail() {
  const router = useRouter()
  const { t } = useLang()
  const program = t.programs.find((p) => p.slug === router.query.slug)

  // Re-observe reveal targets whenever the slug changes so the animation
  // replays on client-side navigation between /loans/[slug] pages, since
  // Next.js reuses this same component instance across dynamic routes.
  useReveal(program?.slug)

  if (!program) {
    return (
      <>
        <Navbar />
        <section className="loan-hero">
          <h1 className="loan-hero-ttl">404</h1>
          <p className="loan-hero-desc">
            <Link href="/#programs">{t.programsBackBtn}</Link>
          </p>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{program.title} Loans — High Point Fundings</title>
        <meta name="description" content={program.tagline} />
      </Head>

      <Navbar />

      <div key={program.slug}>
        <section className="loan-hero" id="top">
          <div className="sec-lbl reveal">{t.programsPageLbl}</div>
          <h1 className="loan-hero-ttl reveal" style={{ transitionDelay: '60ms' }}>{program.title} Loans</h1>
          <p className="loan-hero-tag reveal" style={{ transitionDelay: '120ms' }}>{program.tagline}</p>
          <p className="loan-hero-desc reveal" style={{ transitionDelay: '180ms' }}>{program.description}</p>
          <div className="hero-btns loan-hero-btns reveal" style={{ transitionDelay: '240ms' }}>
            <a href="/#get-quote" className="btn-primary">{t.programsApplyBtn}</a>
            <Link href="/#programs" className="btn-ghost">{t.programsBackBtn}</Link>
          </div>
          <div className="loan-photo reveal reveal-pop" style={{ transitionDelay: '300ms' }}>
            <img src={program.photo} alt={`${program.title} loans — High Point Fundings`} loading="lazy" />
          </div>
        </section>

        <section className="sec">
          <div className="sec-lbl reveal">{t.programsFeaturesLbl}</div>
          <div className="feature-grid">
            {program.features.map((f, i) => (
              <div className="feature-item reveal" style={{ transitionDelay: `${60 + (i % 2) * 90}ms` }} key={i}>
                <span className="feature-check">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="loan-stats">
          <div className="sec-lbl reveal">{t.programsStatsLbl}</div>
          <div className="stat-grid">
            {t.programsRowLabels.map((label, i) => (
              <div className="stat-card reveal reveal-pop" style={{ transitionDelay: `${60 + (i % 4) * 70}ms` }} key={i}>
                <div className="stat-value">{program.values[i]}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <CTA />
      <Footer />
    </>
  )
}
