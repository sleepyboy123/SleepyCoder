interface Props {
  wpm: number
  accuracy: number
  elapsedMs: number
  onPlayAgain: () => void
  onNewSnippet: () => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function ResultCard({ wpm, accuracy, elapsedMs, onPlayAgain, onNewSnippet }: Props) {
  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <div className="text-terminal-accent text-sm tracking-widest uppercase">
        {'>> TRANSMISSION COMPLETE <<'}
      </div>

      <div className="flex gap-12 text-center">
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {wpm}
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">wpm</div>
        </div>
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {accuracy}%
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">accuracy</div>
        </div>
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {formatTime(elapsedMs)}
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">time</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-6 py-2 border border-terminal-border text-terminal-primary hover:border-terminal-accent hover:shadow-glow-sm transition-all duration-200 text-sm tracking-widest uppercase"
        >
          {'[ PLAY AGAIN ]'}
        </button>
        <button
          onClick={onNewSnippet}
          className="px-6 py-2 border border-terminal-accent text-terminal-accent hover:shadow-glow transition-all duration-200 text-sm tracking-widest uppercase"
        >
          {'[ NEW SNIPPET ]'}
        </button>
      </div>
    </div>
  )
}
