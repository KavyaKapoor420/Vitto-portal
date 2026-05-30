import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon, LayoutDashboard, FilePlus } from 'lucide-react'

export default function Navbar({ dark, setDark }) {
  const { pathname } = useLocation()

  const navLink = (to, label, Icon) => {
    const active = pathname === to
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
          ${active
            ? 'bg-[var(--bg-card)] text-[var(--text)] border border-[var(--bg-card-border)]'
            : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
      >
        <Icon size={15} />
        {label}
      </Link>
    )
  }

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[var(--text)] flex items-center justify-center">
            <span className="text-[var(--bg)] text-xs font-bold">V</span>
          </div>
          <span className="font-semibold text-[var(--text)] tracking-tight">vitto</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
          {navLink('/apply', 'Apply', FilePlus)}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(d => !d)}
          className="w-8 h-8 rounded-full flex items-center justify-center border border-[var(--bg-card-border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[#888] transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>

      </div>
    </nav>
  )
}
