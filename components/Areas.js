import USAMap from 'react-usa-map'
import { useLang } from './LangContext'

const UNAVAILABLE_STATES = ['ND', 'SD', 'NV', 'VT']

const customize = UNAVAILABLE_STATES.reduce((acc, abbr) => {
  acc[abbr] = { fill: '#dce6ee' }
  return acc
}, {})

export default function Areas() {
  const { t } = useLang()
  return (
    <section className="areas">
      <div className="sec-lbl reveal">{t.areasLabel}</div>
      <h2 className="sec-ttl reveal" style={{ transitionDelay: '60ms' }}>{t.areasTitle}</h2>
      <p className="sec-sub reveal" style={{ marginBottom: '2.5rem', transitionDelay: '120ms' }}>{t.areasSub}</p>

      <div className="map-card reveal reveal-pop" style={{ transitionDelay: '180ms' }}>
        <div className="map-legend">
          <span className="map-legend-item"><span className="map-legend-dot map-legend-dot-on" />{t.areasAvailable}</span>
          <span className="map-legend-item"><span className="map-legend-dot map-legend-dot-off" />{t.areasUnavailable}</span>
        </div>
        <USAMap customize={customize} defaultFill="#2b6ca3" onClick={() => {}} title="High Point Fundings lending coverage map" />
      </div>

      <p className="areas-metros reveal" style={{ transitionDelay: '240ms' }}>{t.areasMetros}</p>
    </section>
  )
}
