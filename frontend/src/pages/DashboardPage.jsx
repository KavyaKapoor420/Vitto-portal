import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getApplications, getSummary, updateStatus } from '../lib/api'
import {
  LayoutDashboard, Search, RefreshCw, ChevronDown,
  FilePlus, TrendingUp, Clock, CheckCircle2, XCircle, IndianRupee
} from 'lucide-react'

// ── Small reusable pieces ──────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[var(--text-muted)] text-xs mb-0.5">{label}</p>
        <p className="text-[var(--text)] text-lg font-semibold leading-none">{value}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending:  'badge badge-pending',
    approved: 'badge badge-approved',
    rejected: 'badge badge-rejected',
  }
  const dots = { pending: '●', approved: '●', rejected: '●' }
  return (
    <span className={map[status] || 'badge'}>
      <span>{dots[status]}</span>
      {status}
    </span>
  )
}

function LanguageBadge({ language }) {
  return (
    <span className={`badge lang-${language}`}>{language}</span>
  )
}

// Inline status dropdown that appears when you click on an application's status
function StatusUpdater({ appId, currentStatus, onUpdated }) {
  const [open, setOpen]     = useState(false)
  const [loading, setLoading] = useState(false)

  if (currentStatus !== 'pending') {
    // Already finalised — just show the badge, no interaction
    return <StatusBadge status={currentStatus} />
  }

  async function handleSelect(newStatus) {
    setOpen(false)
    setLoading(true)
    try {
      const updated = await updateStatus(appId, newStatus)
      onUpdated(updated)   // parent updates its state — no page reload!
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 badge badge-pending cursor-pointer hover:opacity-80 transition-opacity"
      >
        {loading
          ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          : <><span>●</span>pending<ChevronDown size={10} /></>
        }
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 card shadow-lg min-w-[120px] py-1 animate-fade-in">
          <button
            onClick={() => handleSelect('approved')}
            className="w-full px-3 py-1.5 text-left text-xs text-emerald-600 hover:bg-[var(--bg)] transition-colors"
          >
            ✓ Approve
          </button>
          <button
            onClick={() => handleSelect('rejected')}
            className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-[var(--bg)] transition-colors"
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main dashboard ──────────────────────────────────────────────────
export default function DashboardPage() {
  const [applications, setApplications] = useState([])
  const [summary, setSummary]           = useState(null)
  const [status, setStatus]             = useState('')     // filter
  const [search, setSearch]             = useState('')     // search query
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')

  // Fetch both applications list and summary stats
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [apps, summ] = await Promise.all([
        getApplications({ status: status || undefined, search: search || undefined }),
        getSummary(),
      ])
      setApplications(apps)
      setSummary(summ)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [status, search])

  // Re-fetch whenever filter or search changes
  useEffect(() => {
    // Debounce the search so we don't hit the API on every keystroke
    const timer = setTimeout(fetchData, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  // Called by StatusUpdater after a successful PATCH — updates just that row
  function handleStatusUpdated(updatedApp) {
    setApplications(prev =>
      prev.map(a => a.id === updatedApp.id ? updatedApp : a)
    )
    // Refresh summary counts too
    getSummary().then(setSummary).catch(() => {})
  }

  function formatAmount(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen dot-grid px-4 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--bg-card-border)] bg-[var(--bg-card)] text-[var(--text-muted)] text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-dot" />
                Operations Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">
              Loan Applications
            </h1>
          </div>
          <Link to="/apply" className="btn-primary self-start sm:self-auto">
            <FilePlus size={14} />
            New Application
          </Link>
        </div>

        {/* ── Stats bar ─────────────────────────────────────────────── */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 animate-slide-up delay-100">
            <StatCard
              icon={TrendingUp}
              label="Total Applications"
              value={summary.total_applications}
              color="bg-blue-500/10 text-blue-500"
            />
            <StatCard
              icon={IndianRupee}
              label="Total Requested"
              value={formatAmount(summary.total_amount)}
              color="bg-purple-500/10 text-purple-500"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={summary.pending}
              color="bg-yellow-500/10 text-yellow-500"
            />
            <StatCard
              icon={CheckCircle2}
              label="Approved"
              value={summary.approved}
              color="bg-emerald-500/10 text-emerald-500"
            />
          </div>
        )}

        {/* ── Filters row ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up delay-200">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              className="input-field pl-9"
              type="text"
              placeholder="Search by name or mobile..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              className="input-field appearance-none pr-8 cursor-pointer min-w-[160px]"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchData}
            className="btn-outline px-3"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* ── Table ─────────────────────────────────────────────────── */}
        <div className="card overflow-hidden animate-slide-up delay-300">

          {/* Error state */}
          {error && (
            <div className="px-6 py-4 text-sm text-red-500 flex items-center gap-2">
              <XCircle size={14} /> {error}
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="px-6 py-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-[var(--text)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && applications.length === 0 && (
            <div className="px-6 py-12 text-center">
              <LayoutDashboard size={32} className="text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--text-muted)] text-sm">No applications found.</p>
              <Link to="/apply" className="inline-flex items-center gap-1.5 text-xs text-[var(--text)] underline underline-offset-2 mt-2">
                Submit the first one <FilePlus size={11} />
              </Link>
            </div>
          )}

          {/* Table — desktop */}
          {!loading && !error && applications.length > 0 && (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--bg-card-border)]">
                      {['Applicant', 'Mobile', 'Amount', 'Purpose', 'Language', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id} className="table-row">
                        <td className="px-4 py-3 font-medium text-[var(--text)]">{app.name}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)] font-mono text-xs">{app.mobile}</td>
                        <td className="px-4 py-3 text-[var(--text)] font-medium">{formatAmount(app.amount)}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)] max-w-[180px] truncate" title={app.purpose}>
                          {app.purpose}
                        </td>
                        <td className="px-4 py-3">
                          <LanguageBadge language={app.language} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusUpdater
                            appId={app.id}
                            currentStatus={app.status}
                            onUpdated={handleStatusUpdated}
                          />
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted)] text-xs whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden divide-y divide-[var(--bg-card-border)]">
                {applications.map(app => (
                  <div key={app.id} className="px-4 py-4 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-[var(--text)] text-sm">{app.name}</p>
                        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{app.mobile}</p>
                      </div>
                      <StatusUpdater
                        appId={app.id}
                        currentStatus={app.status}
                        onUpdated={handleStatusUpdated}
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[var(--text)]">{formatAmount(app.amount)}</span>
                      <LanguageBadge language={app.language} />
                    </div>
                    <p className="text-xs text-[var(--text-muted)] truncate">{app.purpose}</p>
                    <p className="text-xs text-[var(--text-muted)]">{formatDate(app.createdAt)}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer row — count */}
          {!loading && applications.length > 0 && (
            <div className="px-4 py-3 border-t border-[var(--bg-card-border)] text-xs text-[var(--text-muted)]">
              Showing {applications.length} application{applications.length !== 1 ? 's' : ''}
              {status ? ` · filtered by "${status}"` : ''}
              {search ? ` · search "${search}"` : ''}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
