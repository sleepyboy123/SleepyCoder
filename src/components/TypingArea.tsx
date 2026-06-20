import { Snippet } from '../lib/snippets/types'
import SnippetDisplay from './SnippetDisplay'
import ResultCard from './ResultCard'

interface Props {
  snippet: Snippet | null
  cursorIndex: number
  errors: Set<number>
  wpm: number
  accuracy: number
  elapsedMs: number
  isComplete: boolean
  isLoading: boolean
  onReset: () => void
  onNewSnippet: () => void
}

export default function TypingArea({
  snippet, cursorIndex, errors, wpm, accuracy, elapsedMs,
  isComplete, isLoading, onReset, onNewSnippet,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-terminal-untyped text-xs tracking-widest animate-pulse">
        {'> LOADING SNIPPET...'}
      </div>
    )
  }

  if (!snippet) return null

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ResultCard
          wpm={wpm}
          accuracy={accuracy}
          elapsedMs={elapsedMs}
          onPlayAgain={onReset}
          onNewSnippet={onNewSnippet}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <SnippetDisplay snippet={snippet} cursorIndex={cursorIndex} errors={errors} />
    </div>
  )
}
