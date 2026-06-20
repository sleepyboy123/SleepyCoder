import { useEffect } from 'react'
import { useTypingGame } from './hooks/useTypingGame'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import GameBar from './components/GameBar'
import TypingArea from './components/TypingArea'

export default function App() {
  const {
    snippet, cursorIndex, errors, elapsedMs,
    isComplete, isLoading, wpm, accuracy, language,
    handleKeyDown, setLanguage, reset, newSnippet,
  } = useTypingGame()

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const progress = snippet ? cursorIndex / snippet.code.length : 0

  return (
    <div
      className="h-screen flex flex-col bg-terminal-bg text-terminal-primary font-mono overflow-hidden"
      style={{ border: '1px solid #3d1a52', boxShadow: '0 0 40px rgba(191, 0, 255, 0.1) inset' }}
    >
      <Header wpm={wpm} accuracy={accuracy} />
      <LanguageSelector language={language} onSelect={setLanguage} />
      <GameBar elapsedMs={elapsedMs} progress={progress} onReset={reset} />
      <TypingArea
        snippet={snippet}
        cursorIndex={cursorIndex}
        errors={errors}
        wpm={wpm}
        accuracy={accuracy}
        elapsedMs={elapsedMs}
        isComplete={isComplete}
        isLoading={isLoading}
        onReset={reset}
        onNewSnippet={newSnippet}
      />
    </div>
  )
}
