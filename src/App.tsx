import { useEffect, useState } from 'react'
import { useTypingGame } from './hooks/useTypingGame'
import { staticProvider } from './lib/snippets/staticProvider'
import { Language, LANGUAGES, Snippet } from './lib/snippets/types'
import Header from './components/Header'
import { Sidebar } from './components/Sidebar'
import GameBar from './components/GameBar'
import TypingArea from './components/TypingArea'

export default function App() {
  const {
    snippet, cursorIndex, errors, elapsedMs,
    isComplete, isLoading, wpm, accuracy, language,
    handleKeyDown, reset, newSnippet, loadSpecificSnippet, loadRandom,
  } = useTypingGame()

  const [allSnippets, setAllSnippets] = useState<Record<Language, Snippet[]>>({} as Record<Language, Snippet[]>)

  useEffect(() => {
    Promise.all(LANGUAGES.map(lang => staticProvider.listSnippets(lang))).then(results => {
      const map = Object.fromEntries(LANGUAGES.map((lang, i) => [lang, results[i]]))
      setAllSnippets(map as Record<Language, Snippet[]>)
    })
  }, [])

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
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          allSnippets={allSnippets}
          activeLanguage={language}
          activeSnippetId={snippet?.id ?? null}
          onSelectSnippet={loadSpecificSnippet}
          onRandom={loadRandom}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
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
      </div>
    </div>
  )
}
