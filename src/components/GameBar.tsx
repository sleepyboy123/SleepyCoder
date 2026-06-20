interface Props {
  elapsedMs: number
  progress: number
  onReset: () => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function GameBar({ elapsedMs, progress, onReset }: Props) {
  const pct = Math.round(Math.min(progress, 1) * 100)

  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-terminal-border">
      <span className="text-terminal-untyped text-xs tracking-widest uppercase w-24 shrink-0">
        TIME: <span className="text-terminal-primary font-bold">{formatTime(elapsedMs)}</span>
      </span>

      <div className="flex-1 h-1.5 bg-terminal-surface border border-terminal-border rounded-none overflow-hidden">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #c084fc)',
            boxShadow: pct > 0 ? '0 0 6px #bf00ff' : 'none',
          }}
        />
      </div>

      <span className="text-terminal-untyped text-xs w-10 shrink-0 text-right">{pct}%</span>

      <button
        onClick={onReset}
        className="text-xs tracking-widest uppercase text-terminal-untyped hover:text-terminal-error border border-terminal-border hover:border-terminal-error px-2 py-1 transition-all duration-150 shrink-0"
      >
        RST
      </button>
    </div>
  )
}
