import { useLang } from './LangContext'

export default function HowItWorks() {
  const { t } = useLang()
  return (
    <section className="sec" id="how-it-works">
      <div className="sec-lbl reveal">{t.stepsLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.stepsTitle}</h2>
      <p className="sec-sub reveal" style={{ transitionDelay: '120ms' }}>{t.stepsSub}</p>
      <div className="steps">
        {t.steps.map((step, i) => (
          <div className="step reveal" style={{ transitionDelay: `${180 + i * 90}ms` }} key={i}>
            <div className="step-dot">{i + 1}</div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
