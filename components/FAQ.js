import { useLang } from './LangContext'

export default function FAQ() {
  const { t } = useLang()
  return (
    <section className="sec" id="faq">
      <div className="sec-lbl reveal">{t.faqLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.faqTitle}</h2>
      <p
        className="sec-sub reveal"
        style={{ marginBottom: '3rem', transitionDelay: '120ms' }}
        dangerouslySetInnerHTML={{ __html: t.faqSub }}
      />
      <div className="faq-grid">
        {t.faqs.map((item, i) => (
          <div className="faq-item reveal" style={{ transitionDelay: `${180 + (i % 2) * 90}ms` }} key={i}>
            <h4>{item.q}</h4>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
