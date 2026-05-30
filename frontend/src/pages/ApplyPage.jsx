import { useState } from 'react'
import { submitApplication } from '../lib/api'
import { CheckCircle, Send, AlertCircle, IndianRupee, User, Phone, FileText, Globe } from 'lucide-react'

// Pill badge shown next to the page heading — mimics your reference design
function PageBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--bg-card-border)] bg-[var(--bg-card)] text-[var(--text-muted)] text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
      {children}
    </span>
  )
}

// Reusable labelled input wrapper
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English']

const EMPTY = { name: '', mobile: '', amount: '', purpose: '', language: '' }

export default function ApplyPage() {
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)   // holds the returned application object
  const [apiError, setApiError] = useState('')

  // Generic change handler — works for input, select, textarea
  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    // Clear the error for this field as the user types
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  // Client-side validation — mirrors the server rules
  function validate() {
    const e = {}
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters'
    if (!form.mobile || !/^\d{10}$/.test(form.mobile))
      e.mobile = 'Mobile must be exactly 10 digits'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid loan amount greater than 0'
    if (!form.purpose.trim() || form.purpose.trim().length < 3)
      e.purpose = 'Purpose must be at least 3 characters'
    if (!form.language)
      e.language = 'Please select a preferred language'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const data = await submitApplication({
        ...form,
        amount: Number(form.amount),
      })
      setSuccess(data.application)   // { id, name, createdAt }
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm(EMPTY)
    setErrors({})
    setSuccess(null)
    setApiError('')
  }

  // ── Success screen ─────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center px-4 pt-20">
        <div className="card p-8 max-w-md w-full text-center animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-1">Application Submitted!</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">
            Your loan application has been received and is under review.
          </p>

          {/* Reference number box */}
          <div className="bg-[var(--bg)] border border-[var(--bg-card-border)] rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-[var(--text-muted)] mb-1">Application Reference</p>
            <p className="font-mono text-sm text-[var(--text)] break-all">{success.id}</p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Applicant: <span className="text-[var(--text)]">{success.name}</span>
            </p>
          </div>

          <button onClick={handleReset} className="btn-primary w-full justify-center">
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen dot-grid px-4 pt-24 pb-16">
      <div className="max-w-xl mx-auto">

        {/* Page header */}
        <div className="mb-8 animate-fade-in">
          <PageBadge>Loan Application</PageBadge>
          <h1 className="text-3xl font-semibold text-[var(--text)] mt-4 mb-2 tracking-tight">
            Apply for a Loan
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Fill in the details below. All fields are required.
          </p>
        </div>

        {/* API-level error banner */}
        {apiError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-500 text-sm flex items-center gap-2 animate-fade-in">
            <AlertCircle size={14} /> {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-5 animate-slide-up delay-100">

          {/* Name */}
          <Field label="Applicant Name" error={errors.name}>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className="input-field pl-9"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ravi Kumar"
                autoComplete="off"
              />
            </div>
          </Field>

          {/* Mobile */}
          <Field label="Mobile Number" error={errors.mobile}>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className="input-field pl-9"
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10-digit number"
                maxLength={10}
              />
            </div>
          </Field>

          {/* Amount */}
          <Field label="Loan Amount (₹)" error={errors.amount}>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                className="input-field pl-9"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 25000"
                min={1}
              />
            </div>
          </Field>

          {/* Purpose */}
          <Field label="Loan Purpose" error={errors.purpose}>
            <div className="relative">
              <FileText size={14} className="absolute left-3 top-3.5 text-[var(--text-muted)]" />
              <textarea
                className="input-field pl-9 resize-none"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="e.g. Small business, Medical expenses, Education..."
                rows={3}
              />
            </div>
          </Field>

          {/* Language */}
          <Field label="Preferred Language" error={errors.language}>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
              <select
                className="input-field pl-9 appearance-none cursor-pointer"
                name="language"
                value={form.language}
                onChange={handleChange}
              >
                <option value="">Select a language</option>
                {LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full justify-center mt-1"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} />
                Submit Application
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  )
}
