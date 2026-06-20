import { Language, LANGUAGES, LANGUAGE_LABELS } from '../lib/snippets/types'

interface Props {
  language: Language
  onSelect: (lang: Language) => void
}

export default function LanguageSelector({ language, onSelect }: Props) {
  return (
    <div className="flex gap-2 px-6 py-3 border-b border-terminal-border overflow-x-auto">
      {LANGUAGES.map((lang) => {
        const isActive = lang === language
        return (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={`
              px-3 py-1 text-xs tracking-widest uppercase border transition-all duration-150 whitespace-nowrap
              ${isActive
                ? 'border-terminal-accent text-terminal-accent shadow-glow-sm'
                : 'border-terminal-border text-terminal-untyped hover:border-terminal-primary hover:text-terminal-primary'
              }
            `}
          >
            {LANGUAGE_LABELS[lang]}
          </button>
        )
      })}
    </div>
  )
}
