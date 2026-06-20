interface Props {
  wpm: number
  accuracy: number
}

export default function Header({ wpm, accuracy }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-terminal-border">
      <div className="text-terminal-accent font-bold tracking-widest text-sm" style={{ textShadow: '0 0 8px #bf00ff' }}>
        {'> SLEEPY_CODER.exe'}
      </div>
      <div className="flex gap-6 text-xs tracking-widest text-terminal-untyped uppercase">
        <span>
          WPM: <span className="text-terminal-primary font-bold">{wpm > 0 ? wpm : '--'}</span>
        </span>
        <span>
          ACC: <span className="text-terminal-primary font-bold">{wpm > 0 ? `${accuracy}%` : '--%'}</span>
        </span>
      </div>
    </div>
  )
}
