import { useState } from 'react'
import { useLang } from './LangContext'

// TODO: replace with your real Formspree endpoint (create one free at formspree.io)
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

export default function QuickQuote() {
  const { t } = useLang()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [btnText, setBtnText] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    setLoading(true)
    setBtnText('Sending…')

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setBtnText('Error — try again')
        setLoading(false)
      }
    } catch {
      setBtnText('Error — try again')
      setLoading(false)
    }
  }

  return (
    <section className="quick-quote" id="get-quote">
      <div className="qq-inner">
        <div className="sec-lbl reveal">{t.formLabel}</div>
        <h2 className="sec-ttl reveal" style={{ marginBottom: '2.5rem', transitionDelay: '60ms' }}>{t.formTitleBig}</h2>

        <div className="form-card reveal reveal-pop" style={{ transitionDelay: '180ms' }}>
          <div className="form-head">
            <h3>{t.formTitle}</h3>
            <p>{t.formSubSmall}</p>
          </div>

          {submitted ? (
            <div className="form-success" style={{ display: 'block' }}>
              <div className="success-icon">✓</div>
              <h4>{t.successTitle}</h4>
              <p>{t.successMsg}</p>
            </div>
          ) : (
            <div className="form-body">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="field">
                    <label>{t.labelName}</label>
                    <input type="text" name="name" placeholder={t.placeholderName} required />
                  </div>
                  <div className="field">
                    <label>{t.labelPhone}</label>
                    <input type="tel" name="phone" placeholder={t.placeholderPhone} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>{t.labelEmail}</label>
                    <input type="email" name="email" placeholder={t.placeholderEmail} required />
                  </div>
                  <div className="field">
                    <label>{t.labelLoanProgram}</label>
                    <select name="loan_program" defaultValue="" required>
                      <option value="" disabled>{t.loanProgramOptions[0]}</option>
                      {t.loanProgramOptions.slice(1).map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>{t.labelAddress}</label>
                    <input type="text" name="property_address" placeholder={t.placeholderAddress} required autoComplete="off" />
                  </div>
                  <div className="field">
                    <label>{t.labelLoanAmount}</label>
                    <input type="text" name="loan_amount" placeholder={t.placeholderLoanAmount} required />
                  </div>
                </div>
                <div className="field">
                  <label>{t.labelMessage}</label>
                  <textarea name="message" placeholder={t.placeholderMessage} />
                </div>
                <button type="submit" className="form-btn" disabled={loading}>
                  {btnText || t.formBtn}
                </button>
                <p className="form-note">{t.formNote}</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
