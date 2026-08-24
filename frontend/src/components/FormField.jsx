export default function FormField({ label, error, ...inputProps }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {label}
      </label>
      <input
        {...inputProps}
        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: 'var(--bg-app)',
          borderColor: error ? 'var(--color-danger)' : 'var(--border-subtle)',
          color: 'var(--text-primary)',
        }}
      />
      {error && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  );
}
