import { Link } from 'react-router-dom'
import { ArrowRight, LayoutDashboard, FilePlus, Shield, Zap, Globe } from 'lucide-react'

function FeatureCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--text)] mb-1">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen dot-grid flex flex-col items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-3xl w-full mx-auto text-center">

        {/* Pill badge */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--bg-card-border)] bg-[var(--bg-card)] text-[var(--text-muted)] text-xs font-medium shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" style={{animation:'pulseDot 2s ease-in-out infinite'}} />
            Inclusive FinTech  Field Operations Portal
            <ArrowRight size={11} className="text-[var(--text-muted)]" />
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--text)] tracking-tight leading-tight mb-4 animate-slide-up">
          Loan Applications,{' '}
          <span className="italic font-light text-[var(--text-muted)]">simplified</span>
        </h1>

        <p className="text-[var(--text-muted)] text-base sm:text-lg max-w-xl mx-auto mb-10 animate-slide-up delay-100">
          Vitto helps field agents track borrower applications in{' '}
          <strong className="text-[var(--text)] font-medium">Hindi, Tamil, Telugu, Marathi</strong> and English  from submission to approval in one place.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14 animate-slide-up delay-200">
          <Link to="/apply" className="btn-primary px-6 py-2.5 text-base w-full sm:w-auto justify-center">
            <FilePlus size={16} />
            Apply for a Loan
          </Link>
          <Link to="/dashboard" className="btn-outline px-6 py-2.5 text-base w-full sm:w-auto justify-center">
            <LayoutDashboard size={16} />
            View Dashboard
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-3 animate-slide-up delay-300">
          <FeatureCard
            icon={Globe}
            title="Multi-Language Support"
            desc="Accept applications in 5 regional languages. Language preference is stored with every application."
            color="bg-orange-500/10 text-orange-500"
          />
          <FeatureCard
            icon={Zap}
            title="Real-Time Status Updates"
            desc="Agents can approve or reject applications instantly. Status badges update without reloading the page."
            color="bg-blue-500/10 text-blue-500"
          />
          <FeatureCard
            icon={Shield}
            title="Validated at Every Step"
            desc="Client-side and server-side validation ensures clean data. No bad entries reach the database."
            color="bg-emerald-500/10 text-emerald-500"
          />
        </div>

      </div>
    </div>
  )
}
