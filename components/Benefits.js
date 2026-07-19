import { useLang } from './LangContext'

export default function Benefits() {
  const { t } = useLang()
  return (
    <section className="sec" id="why-us">
      <div className="sec-lbl reveal">{t.whyLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.whyTitle}</h2>
      <p className="sec-sub reveal" style={{ transitionDelay: '120ms' }}>{t.whySub}</p>
      <div className="bene-grid">
        {t.benefits.map((b, i) => (
          <div className="bene-card reveal" style={{ transitionDelay: `${180 + (i % 3) * 90}ms` }} key={i}>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
