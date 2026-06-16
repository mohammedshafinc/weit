const LINKEDIN_URL = 'https://www.linkedin.com/in/mohammedshafin'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-14 border-t border-white/5 pt-6">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path
                d="M7 21 L13 14 L18 18 L25 9"
                stroke="#34d399"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="25" cy="9" r="2.6" fill="#34d399" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-200">Supercomp</div>
            <div className="text-xs text-ink-600">
              Private &amp; offline · your data stays in this browser
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 sm:items-end">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-ink-300 transition-colors hover:bg-white/5 hover:text-ink-50"
          >
            <span className="text-ink-500">Designed &amp; developed by</span>
            <span className="font-semibold text-brand-300 group-hover:text-brand-200">
              Mohammed Shafin
            </span>
            <LinkedInIcon />
          </a>
          <div className="text-xs text-ink-600">
            © {year} · Built with React &amp; TypeScript
          </div>
        </div>
      </div>
    </footer>
  )
}

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-[#0a66c2] transition-transform group-hover:scale-110"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}
