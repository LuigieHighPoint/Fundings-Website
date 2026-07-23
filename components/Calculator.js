import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useLang } from './LangContext'

const STORAGE_KEY = 'hpf-calc-values'

function parseMoney(str) {
  return Number(str.replace(/[^0-9.]/g, '')) || 0
}

function parseRange(str) {
  const nums = (str.match(/[\d.]+/g) || []).map(Number)
  if (nums.length >= 2) return [nums[0], nums[1]]
  return [nums[0] || 0, nums[0] || 0]
}

// "90%" -> 90, "–" (not applicable) -> null
function parsePercentCap(str) {
  const nums = str.match(/[\d.]+/g)
  return nums ? Number(nums[0]) : null
}

// DSCR Rental and Portfolio are the two long-term amortizing programs (30-yr
// fixed style); everything else is short/mid-term interest-only. Keyed off
// slug (language-independent) rather than parsing "year"/"yr" out of the
// term string, since that text is localized ("30 años fijo" in Spanish).
const AMORTIZING_SLUGS = ['dscr-rental', 'portfolio']

// Only these exit-focused programs get the "keep it as a rental?" cross-sell
// — it doesn't make sense on Bridge, Refinance, or Portfolio (already
// long-term hold plays), or on DSCR Rental itself.
const DSCR_CROSS_SELL_SLUGS = ['fix-and-flip', 'new-construction', 'multifamily']

// Extracts the numeric term options from a term string ("6, 12, 18 mo" or
// "12–36 mo" or "5, 10, 30 yr") — the digits are language-independent even
// though the surrounding unit words are localized.
function parseTerm(str, isAmortizing) {
  const nums = (str.match(/\d+/g) || []).map(Number)
  const isRange = str.includes('–') && !str.includes(',')
  return { unit: isAmortizing ? 'years' : 'months', isRange, options: nums.length ? nums : [12] }
}

function formatMoney(n) {
  return `$${Math.round(n).toLocaleString('en-US')}`
}

function roundTo(n, step) {
  return Math.round(n / step) * step
}

// Sensible starting numbers for a program the borrower hasn't touched yet.
function getDefaults(parsed) {
  const rehabBudget = parsed.ltcCap !== null ? roundTo(parsed.minLoan * 0.25, 1000) : 0
  const arv = roundTo((parsed.minLoan + rehabBudget) * 1.2, 1000)
  const termValue = parsed.term.isRange
    ? parsed.term.options[0]
    : parsed.term.options[Math.floor(parsed.term.options.length / 2)]
  return { purchasePrice: parsed.minLoan, rehabBudget, arv, rate: parsed.rateMin, points: parsed.pointsMin, termValue }
}

function parseProgram(program) {
  const [minLoanStr, rateStr, pointsStr, ltcStr, ltvStr, termStr] = program.values
  const minLoan = parseMoney(minLoanStr)
  const [rateMin, rateMax] = parseRange(rateStr)
  const [pointsMin, pointsMax] = parseRange(pointsStr)
  const ltcCap = parsePercentCap(ltcStr)
  const ltvCap = parsePercentCap(ltvStr)
  const isAmortizing = AMORTIZING_SLUGS.includes(program.slug)
  const term = parseTerm(termStr, isAmortizing)
  const maxLoan = minLoan >= 75000 ? 5000000 : 2000000
  return { minLoan, maxLoan, rateMin, rateMax, pointsMin, pointsMax, ltcCap, ltvCap, term }
}

// Click-to-edit value: shows the formatted value as a span; clicking swaps
// it for a raw number input so the user can type an exact figure instead of
// only dragging the slider. Commits (clamped to min/max) on blur or Enter.
function EditableValue({ value, format, min, max, step, onChange }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  function startEdit() {
    setDraft(String(value))
    setEditing(true)
  }

  function commit() {
    let n = Number(draft)
    if (Number.isNaN(n)) n = value
    n = Math.min(max, Math.max(min, n))
    onChange(n)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        type="number" className="calc-field-input" autoFocus
        step={step} min={min} max={max}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }
  return (
    <span className="calc-field-value calc-field-value-editable" onClick={startEdit} title="Click to enter a custom amount">
      {format(value)}
    </span>
  )
}

export default function Calculator() {
  const { t } = useLang()
  const [programIdx, setProgramIdx] = useState(0)
  const program = t.programs[programIdx]
  const parsed = useMemo(() => parseProgram(program), [program])

  const arvMax = roundTo(parsed.maxLoan * 1.5, 1000)
  const defaults = useMemo(() => getDefaults(parsed), [parsed])

  // Each program keeps its own set of entered numbers, independent of the
  // others — switching programs never carries a value over from one to the
  // next, but coming back to a program you've already edited restores it.
  // Persisted to localStorage so the numbers also survive navigating to
  // another page and back.
  const [savedValues, setSavedValues] = useState({})
  const skipNextSave = useRef(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSavedValues(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedValues))
    } catch {}
  }, [savedValues])

  const current = savedValues[program.slug] || defaults

  function setField(field, value) {
    setSavedValues((prev) => ({
      ...prev,
      [program.slug]: { ...(prev[program.slug] || defaults), [field]: value },
    }))
  }

  const { purchasePrice, rehabBudget, arv, rate, points, termValue } = current

  const results = useMemo(() => {
    const hasLTC = parsed.ltcCap !== null
    const totalProjectCost = purchasePrice + rehabBudget
    // The two independent lending caps: what LTC allows against total cost,
    // and what LTV allows against ARV. The loan actually qualifies for
    // whichever is lower — the borrower-facing rows below show both caps
    // individually (with their %) as a reference for how each is derived.
    const loanByLTC = hasLTC ? totalProjectCost * (parsed.ltcCap / 100) : Infinity
    const loanByLTV = arv * (parsed.ltvCap / 100)
    const loanAmount = Math.max(0, Math.min(loanByLTC, loanByLTV))

    const isAmortizing = parsed.term.unit === 'years'
    const termMonths = isAmortizing ? termValue * 12 : termValue
    let monthlyPayment

    if (isAmortizing) {
      const monthlyRate = rate / 100 / 12
      const n = termMonths
      monthlyPayment = monthlyRate === 0
        ? loanAmount / n
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
    } else {
      monthlyPayment = loanAmount * (rate / 100) / 12
    }

    // Cross-sell: if the borrower decides to hold the property as a rental
    // instead of exiting, show what a DSCR Rental loan would look like
    // against the same ARV (the property's stabilized post-repair value).
    // Skipped when DSCR Rental is already the selected program.
    let dscrCross = null
    if (DSCR_CROSS_SELL_SLUGS.includes(program.slug)) {
      const dscrProgram = t.programs.find((p) => p.slug === 'dscr-rental')
      if (dscrProgram) {
        const dscrParsed = parseProgram(dscrProgram)
        const dscrLoanAmount = arv * (dscrParsed.ltvCap / 100)
        const dscrMonthlyRate = dscrParsed.rateMin / 100 / 12
        const dscrTermMonths = dscrParsed.term.options[0] * 12
        const dscrMonthlyPayment = dscrMonthlyRate === 0
          ? dscrLoanAmount / dscrTermMonths
          : (dscrLoanAmount * dscrMonthlyRate * Math.pow(1 + dscrMonthlyRate, dscrTermMonths)) /
            (Math.pow(1 + dscrMonthlyRate, dscrTermMonths) - 1)
        dscrCross = { loanAmount: dscrLoanAmount, monthlyPayment: dscrMonthlyPayment }
      }
    }

    return {
      isAmortizing,
      totalProjectCost,
      hasLTC,
      loanByLTC,
      loanByLTV,
      monthlyPayment,
      dscrCross,
    }
  }, [purchasePrice, rehabBudget, arv, rate, termValue, parsed, program, t])

  return (
    <div className="calc-grid">
      <div className="calc-card">
        <div className="calc-field">
          <label>{t.calcProgramLbl}</label>
          <select value={programIdx} onChange={(e) => setProgramIdx(Number(e.target.value))}>
            {t.programs.map((p, i) => (
              <option key={i} value={i}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcPurchaseLbl}</label>
            <EditableValue
              value={purchasePrice} format={formatMoney}
              min={parsed.minLoan} max={parsed.maxLoan} step={1000}
              onChange={(v) => setField('purchasePrice', v)}
            />
          </div>
          <input
            type="range" min={parsed.minLoan} max={parsed.maxLoan} step={1000}
            value={purchasePrice} onChange={(e) => setField('purchasePrice', Number(e.target.value))}
          />
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcRehabLbl}</label>
            <EditableValue
              value={rehabBudget} format={formatMoney}
              min={0} max={parsed.maxLoan} step={1000}
              onChange={(v) => setField('rehabBudget', v)}
            />
          </div>
          <input
            type="range" min={0} max={parsed.maxLoan} step={1000}
            value={rehabBudget} onChange={(e) => setField('rehabBudget', Number(e.target.value))}
          />
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcArvLbl}</label>
            <EditableValue
              value={arv} format={formatMoney}
              min={25000} max={arvMax} step={1000}
              onChange={(v) => setField('arv', v)}
            />
          </div>
          <input
            type="range" min={25000} max={arvMax} step={1000}
            value={arv} onChange={(e) => setField('arv', Number(e.target.value))}
          />
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcRateLbl}</label>
            <EditableValue
              value={rate} format={(v) => `${v.toFixed(2)}%`}
              min={parsed.rateMin} max={parsed.rateMax} step={0.01}
              onChange={(v) => setField('rate', v)}
            />
          </div>
          <input
            type="range" min={parsed.rateMin} max={parsed.rateMax} step={0.01}
            value={rate} onChange={(e) => setField('rate', Number(e.target.value))}
            disabled={parsed.rateMin === parsed.rateMax}
          />
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcPointsLbl}</label>
            <EditableValue
              value={points} format={(v) => v.toFixed(2)}
              min={parsed.pointsMin} max={parsed.pointsMax} step={0.05}
              onChange={(v) => setField('points', v)}
            />
          </div>
          <input
            type="range" min={parsed.pointsMin} max={parsed.pointsMax} step={0.05}
            value={points} onChange={(e) => setField('points', Number(e.target.value))}
            disabled={parsed.pointsMin === parsed.pointsMax}
          />
        </div>

        <div className="calc-field">
          <div className="calc-field-top">
            <label>{t.calcTermLbl}</label>
            <span className="calc-field-value">
              {termValue} {parsed.term.unit === 'years' ? t.calcYearsUnit : t.calcMonthsUnit}
            </span>
          </div>
          {parsed.term.isRange ? (
            <input
              type="range" min={parsed.term.options[0]} max={parsed.term.options[1]} step={1}
              value={termValue} onChange={(e) => setField('termValue', Number(e.target.value))}
            />
          ) : (
            <div className="calc-term-pills">
              {parsed.term.options.map((opt) => (
                <button
                  type="button" key={opt}
                  className={`calc-term-pill ${termValue === opt ? 'active' : ''}`}
                  onClick={() => setField('termValue', opt)}
                >
                  {opt} {parsed.term.unit === 'years' ? t.calcYearsUnit : t.calcMonthsUnit}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="calc-results">
        <span className="calc-results-lbl">{t.calcResultsLbl}</span>
        <div className="calc-results-num">{formatMoney(results.monthlyPayment)}</div>
        <div className="calc-results-sub">
          {results.isAmortizing ? t.calcAmortizingNote : t.calcInterestOnlyNote} · {t.calcMonthlyLbl}
        </div>

        <div className="calc-result-row">
          <span>{t.calcProjectCostLbl}</span>
          <span>{formatMoney(results.totalProjectCost)}</span>
        </div>
        {results.hasLTC && (
          <div className="calc-result-row calc-result-metric">
            <span>{t.calcLtcResultLbl} · {parsed.ltcCap}%</span>
            <span>{formatMoney(results.loanByLTC)}</span>
          </div>
        )}
        <div className="calc-result-row calc-result-metric">
          <span>{t.calcLtvResultLbl} · {parsed.ltvCap}%</span>
          <span>{formatMoney(results.loanByLTV)}</span>
        </div>
        <a href="/#get-quote" className="btn-primary calc-cta">{t.calcCtaBtn}</a>

        {results.dscrCross && (
          <div className="calc-cross">
            <div className="calc-cross-ttl">{t.calcDscrCrossTtl}</div>
            <p className="calc-cross-sub">{t.calcDscrCrossSub}</p>
            <div className="calc-result-row">
              <span>{t.calcDscrLoanLbl}</span>
              <span>{formatMoney(results.dscrCross.loanAmount)}</span>
            </div>
            <div className="calc-result-row">
              <span>{t.calcDscrMonthlyLbl}</span>
              <span>{formatMoney(results.dscrCross.monthlyPayment)}</span>
            </div>
            <Link href="/loans/dscr-rental" className="btn-ghost calc-cross-link">{t.calcDscrLinkBtn}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
