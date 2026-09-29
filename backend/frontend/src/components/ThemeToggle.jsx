import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors"
      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
    >
      {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
    </button>
  );
}
