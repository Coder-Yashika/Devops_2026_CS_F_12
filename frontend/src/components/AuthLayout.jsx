import ThemeToggle from './ThemeToggle';

// One shared shell for Login / Register / Verify OTP pages, so the visual
// language (card, spacing, header) stays consistent without repeating it in
// every page component.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-app)' }}>
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center text-white font-display font-bold"
            style={{ backgroundColor: 'var(--color-brand-600)' }}
          >
            OD
          </div>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            College ODS System
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div
          className="w-full max-w-md rounded-xl border p-8 shadow-sm"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          <h1 className="font-display text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
