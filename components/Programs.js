import { useLang } from './LangContext'

export default function Programs() {
  const { t } = useLang()
  return (
    <section className="sec" id="programs">
      <div className="sec-lbl reveal">{t.programsLabel}</div>
      <h2 className="sec-ttl reveal" style={{ marginBottom: '3.5rem', transitionDelay: '60ms' }}>{t.programsTitle}</h2>
      <div className="prog-table-wrap reveal" style={{ transitionDelay: '140ms' }}>
        <table className="prog-table">
          <thead>
            <tr>
              <th />
              {t.programs.map((p, i) => (
                <th key={i}>
                  <span className="prog-th-name">{p.title}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.programsRowLabels.map((label, ri) => (
              <tr key={ri}>
                <td className="prog-row-lbl">{label}</td>
                {t.programs.map((p, pi) => (
                  <td key={pi}>{p.values[ri]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="prog-footnote">{t.programsFootnote}</p>
    </section>
  )
}
