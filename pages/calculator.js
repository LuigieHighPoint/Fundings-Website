import Head from 'next/head'
import Navbar from '../components/Navbar'
import Calculator from '../components/Calculator'
import { CTA, Footer } from '../components/CTAFooter'
import { useLang } from '../components/LangContext'
import { useReveal } from '../components/useReveal'

export default function CalculatorPage() {
  const { t } = useLang()
  useReveal()

  return (
    <>
      <Head>
        <title>Rate Calculator — High Point Fundings</title>
        <meta name="description" content="Estimate your monthly payment, interest, and points across any High Point Fundings loan program." />
      </Head>

      <Navbar />

      <section className="loan-hero" id="top">
        <div className="sec-lbl reveal">{t.calcPageLbl}</div>
        <h1 className="loan-hero-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.calcTitle}</h1>
        <p className="loan-hero-desc reveal" style={{ transitionDelay: '120ms', marginBottom: '2.5rem' }}>{t.calcSub}</p>
      </section>

      <section className="sec calc-sec">
        <div className="reveal reveal-pop" style={{ transitionDelay: '180ms' }}>
          <Calculator />
        </div>
        <p className="calc-disclaimer reveal" style={{ transitionDelay: '240ms' }}>{t.calcDisclaimer}</p>
      </section>

      <CTA />
      <Footer />
    </>
  )
}
