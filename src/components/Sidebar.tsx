import { useEffect, useState } from 'react'
import { Language, LANGUAGES, Snippet } from '../lib/snippets/types'

const EXTENSIONS: Record<Language, string> = {
  python: '.py',
  typescript: '.ts',
  c: '.c',
  cpp: '.cpp',
  java: '.java',
  go: '.go',
  rust: '.rs',
  bash: '.sh',
}

function toFileName(title: string, language: Language): string {
  return title.toLowerCase().replace(/\s+/g, '-') + EXTENSIONS[language]
}

interface SidebarProps {
  allSnippets: Record<Language, Snippet[]>
  activeLanguage: Language
  activeSnippetId: string | null
  onSelectSnippet: (language: Language, id: string) => void
  onRandom: () => void
}

export function Sidebar({ allSnippets, activeLanguage, activeSnippetId, onSelectSnippet, onRandom }: SidebarProps) {
  const [openFolders, setOpenFolders] = useState<Set<Language>>(new Set([activeLanguage]))

  useEffect(() => {
    setOpenFolders(prev => { const next = new Set(prev); next.add(activeLanguage); return next })
  }, [activeLanguage])

  function toggleFolder(lang: Language) {
    setOpenFolders(prev => {
      const next = new Set(prev)
      if (next.has(lang)) next.delete(lang)
      else next.add(lang)
      return next
    })
  }

  function handleFileClick(lang: Language, id: string) {
    if (!openFolders.has(lang)) {
      setOpenFolders(prev => { const next = new Set(prev); next.add(lang); return next })
    }
    onSelectSnippet(lang, id)
  }

  return (
    <div className="w-48 flex-shrink-0 flex flex-col border-r border-terminal-border bg-terminal-bg">
      <div className="px-3 py-2 text-xs text-terminal-untyped uppercase tracking-widest border-b border-terminal-border flex-shrink-0">
        Explorer
      </div>

      <button
        onClick={onRandom}
        className="mx-2 my-2 px-2 py-1 text-xs border border-terminal-accent text-terminal-accent hover:bg-terminal-accent hover:text-terminal-bg transition-colors font-mono tracking-wider flex-shrink-0"
      >
        [ RND ]
      </button>

      <div className="border-b border-terminal-border flex-shrink-0" />

      <div className="flex-1 overflow-y-auto">
        {LANGUAGES.map(lang => {
          const isOpen = openFolders.has(lang)
          const snippets = allSnippets[lang] ?? []
          const isActiveLang = lang === activeLanguage

          return (
            <div key={lang}>
              <button
                onClick={() => toggleFolder(lang)}
                className={`w-full flex items-center gap-1 px-2 py-0.5 text-xs hover:bg-terminal-surface transition-colors font-mono ${
                  isActiveLang ? 'text-terminal-accent' : 'text-terminal-untyped hover:text-terminal-primary'
                }`}
              >
                <span
                  className="w-3 text-center flex-shrink-0 inline-block transition-transform duration-150"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >›</span>
                <span className="flex-shrink-0">{isOpen ? '🖿' : '🖿'}</span>
                <span>{lang}/</span>
              </button>

              {isOpen && snippets.map(snippet => {
                const isActive = snippet.id === activeSnippetId
                return (
                  <button
                    key={snippet.id}
                    onClick={() => handleFileClick(lang, snippet.id)}
                    className={`w-full flex items-center py-0.5 text-xs font-mono transition-colors border-l-2 ${
                      isActive
                        ? 'border-terminal-accent text-terminal-primary bg-terminal-surface'
                        : 'border-transparent text-terminal-untyped hover:text-terminal-primary hover:bg-terminal-surface'
                    }`}
                  >
                    <span className="pl-6 pr-2 truncate text-left">{toFileName(snippet.title, lang)}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
