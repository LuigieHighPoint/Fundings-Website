import { useEffect, useState } from 'react'
import { useLang } from './LangContext'

const CYCLE_MS = 3500
const FADE_MS = 400

export default function Hero() {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setIdx(0)
    setVisible(true)
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % t.programs.length)
        setVisible(true)
      }, FADE_MS)
    }, CYCLE_MS)
    return () => clearInterval(timer)
  }, [t.programs])

  const program = t.programs[idx % t.programs.length]
  const [minLoan, rateRange, , ltc, ltv, term, closing] = program.values
  const startingRate = rateRange.split(' – ')[0]
  const hasLtc = ltc !== '–'
  const secondaryLabel = hasLtc ? t.programsRowLabels[3] : t.programsRowLabels[4]
  const secondaryValue = hasLtc ? ltc : ltv

  return (
    <section className="hero" id="top">
      <div className="hero-left">
        <span className="hero-badge reveal" style={{ transitionDelay: '0ms' }}>{t.badge}</span>
        <h1 className="reveal" style={{ transitionDelay: '80ms' }}>
          {t.h1Line1}<br />
          {t.h1Line2}<span className="blue-word">{t.h1Word}</span>
        </h1>
        <div className="hero-btns reveal" style={{ transitionDelay: '240ms' }}>
          <a href="#get-quote" className="btn-primary">{t.btn1}</a>
          <a href="#how-it-works" className="btn-ghost">{t.btn2}</a>
        </div>
        <div className="hero-stats reveal" style={{ transitionDelay: '320ms' }}>
          {t.heroStats.map(([value, label], i) => (
            <div className="hero-stat" key={i}>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-visual reveal reveal-pop" style={{ transitionDelay: '220ms' }}>
        <div className="rate-card">
          <div className={`rate-card-content ${visible ? 'is-visible' : ''}`}>
            <div className="rate-card-top">
              <span className="rate-card-lbl">{t.rateCardLbl}</span>
              <span className="rate-card-pill">{program.title}</span>
            </div>
            <div className="rate-card-num">{startingRate}</div>
            <div className="rate-card-sub">{t.rateCardStartingLbl} · {term}</div>
            <div className="rate-card-row">
              <span>{t.programsRowLabels[0]}</span>
              <span>{minLoan}</span>
            </div>
            <div className="rate-card-row">
              <span>{secondaryLabel}</span>
              <span>{secondaryValue}</span>
            </div>
            <div className="rate-card-row">
              <span>{t.programsRowLabels[6]}</span>
              <span>{closing}</span>
            </div>
          </div>
          <div className="float-badge b1"><span className="dot" />{t.floatBadge1}</div>
          <div className="float-badge b2">{t.floatBadge2}</div>
        </div>
      </div>
    </section>
  )
}
