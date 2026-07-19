import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLang } from './LangContext'

// TODO: replace with your real Formspree endpoint (create one free at formspree.io)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

export function CTA() {
  const { t } = useLang()
  return (
    <section className="cta-sec">
      <div className="sec-lbl reveal" style={{ display: 'block', textAlign: 'center' }}>{t.ctaLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.ctaTitle}</h2>
      <p className="sec-sub reveal" style={{ transitionDelay: '120ms' }}>{t.ctaSub}</p>
      <a href="tel:+19728027521" className="cta-phone reveal reveal-pop" style={{ transitionDelay: '180ms' }}>(972) 802-7521</a>
      <span className="cta-phone-lbl reveal" style={{ transitionDelay: '220ms' }}>{t.ctaPhoneLbl}</span>
      <a href="#get-quote" className="btn-primary reveal" style={{ display: 'inline-block', transitionDelay: '260ms' }}>{t.ctaBtn}</a>
    </section>
  )
}

export function Footer() {
  const { t } = useLang()
  const router = useRouter()
  const isHome = router.pathname === '/'
  const anchor = (id) => (isHome ? `#${id}` : `/#${id}`)

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-brand-col">
          <div className="foot-logo">
            <span className="nl1">HIGH POINT</span>
            <span className="nl2">FUNDINGS</span>
          </div>
          <p className="foot-tagline">{t.footTagline}</p>

          <div className="foot-signup">
            <h4 className="foot-signup-ttl">{t.footSignupHeadline1} <span className="foot-signup-accent">{t.footSignupHeadline2}</span></h4>
            {submitted ? (
              <p className="foot-signup-success">{t.footSuccessMsg}</p>
            ) : (
              <form onSubmit={handleSubmit} className="foot-signup-form">
                <input type="email" name="email" placeholder={t.footEmailPlaceholder} required />
                <label className="foot-consent">
                  <input type="checkbox" name="consent" required />
                  <span>{t.footConsentLabel}</span>
                </label>
                <button type="submit" className="foot-signup-btn" disabled={loading}>{t.footSubmitBtn}</button>
              </form>
            )}
          </div>
        </div>

        <div className="foot-col">
          <h5>{t.footColLoans}</h5>
          <ul>
            {t.programs.map((p, i) => (
              <li key={i}><Link href={`/loans/${p.slug}`}>{p.title}</Link></li>
            ))}
          </ul>
        </div>

        <div className="foot-col">
          <h5>{t.footColCompany}</h5>
          <ul>
            <li><a href={anchor('programs')}>{t.navPrograms}</a></li>
            <li><Link href="/calculator">{t.navCalculator}</Link></li>
            <li><a href={anchor('how-it-works')}>{t.navHow}</a></li>
            <li><a href={anchor('why-us')}>{t.navWhy}</a></li>
            <li><a href={anchor('faq')}>{t.navFaq}</a></li>
          </ul>
        </div>

        <div className="foot-col">
          <h5>{t.footColContact}</h5>
          <ul>
            <li><a href="tel:+19728027521">(972) 802-7521</a></li>
            <li><a href="mailto:loans@highpointfundings.com">loans@highpointfundings.com</a></li>
            <li><a href={anchor('get-quote')}>{t.navCta}</a></li>
          </ul>
        </div>
      </div>

      <p className="foot-disclaimer">{t.footDisclaimer}</p>
      <div className="foot-bot">
        <span className="foot-copy">© 2026 High Point Fundings. All rights reserved.</span>
        <a href="https://highpointfundings.com" className="foot-url">highpointfundings.com</a>
      </div>
    </footer>
  )
}
