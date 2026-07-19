import { useState } from 'react'
import { useLang } from './LangContext'

export default function Compare() {
  const { t } = useLang()
  const [hover, setHover] = useState(null) // 'hpf' | 'bank' | null

  const highlightStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '30%',
    pointerEvents: 'none',
    borderRadius: '2px 2px 0 0',
    transition: 'left 0.3s ease, border-color 0.3s ease, background 0.3s ease, opacity 0.25s ease',
    borderTop: '2px solid',
    borderLeft: '2px solid',
    borderRight: '2px solid',
    borderBottom: 'none',
    opacity: hover ? 1 : 0,
    left: hover === 'bank' ? '70%' : '40%',
    borderColor: hover === 'bank' ? '#e74c3c' : '#2ecc71',
    background: hover === 'bank' ? 'rgba(231,76,60,0.07)' : 'rgba(46,204,113,0.08)',
  }

  return (
    <section className="compare">
      <div className="sec-lbl reveal">{t.compareLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.compareTitle}</h2>
      <p className="sec-sub reveal" style={{ marginBottom: '3rem', transitionDelay: '120ms' }}>{t.compareSub}</p>
      <div className="ctbl-wrap reveal" style={{ position: 'relative', maxWidth: 860, margin: '0 auto', transitionDelay: '180ms' }}>
        <div style={highlightStyle} />
        <table className="ctbl">
          <thead>
            <tr>
              <th style={{ width: '40%', textAlign: 'left' }}>What matters</th>
              <th
                className="hpf hpf-h"
                style={{ width: '30%', color: hover === 'hpf' ? '#2ecc71' : undefined, transition: 'color 0.2s' }}
                onMouseEnter={() => setHover('hpf')}
                onMouseLeave={() => setHover(null)}
              >
                High Point Fundings
              </th>
              <th
                style={{ width: '30%', color: hover === 'bank' ? '#e74c3c' : undefined, transition: 'color 0.2s' }}
                onMouseEnter={() => setHover('bank')}
                onMouseLeave={() => setHover(null)}
              >
                Traditional bank
              </th>
            </tr>
          </thead>
          <tbody>
            {t.compareRows.map(([label, hpf, bank], i) => (
              <tr key={i}>
                <td>{label}</td>
                <td
                  className={`hpf yes ${hover === 'hpf' ? 'hover-green' : ''}`}
                  onMouseEnter={() => setHover('hpf')}
                  onMouseLeave={() => setHover(null)}
                >
                  {hpf}
                </td>
                <td
                  className={`no ${hover === 'bank' ? 'hover-red' : ''}`}
                  onMouseEnter={() => setHover('bank')}
                  onMouseLeave={() => setHover(null)}
                >
                  {bank}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
