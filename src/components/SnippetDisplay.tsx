import { Snippet } from '../lib/snippets/types'

interface Props {
  snippet: Snippet
  cursorIndex: number
  errors: Set<number>
}

export default function SnippetDisplay({ snippet, cursorIndex, errors }: Props) {
  const chars = snippet.code.split('')

  return (
    <div className="p-6">
      <p className="text-terminal-untyped text-xs mb-4 tracking-widest uppercase">
        {'// '}{snippet.title}
      </p>
      <pre className="text-base leading-7 whitespace-pre-wrap break-all font-mono">
        {chars.map((char, index) => {
          const isCorrect = index < cursorIndex && !errors.has(index)
          const isError = errors.has(index)
          const isCursor = index === cursorIndex

          if (char === '\n') {
            return (
              <span key={index}>
                <span className="text-terminal-untyped opacity-40 select-none">↵</span>
                {isCursor && <span className="cursor-caret" aria-hidden="true" />}
                {'\n'}
              </span>
            )
          }

          return (
            <span
              key={index}
              className={
                isError
                  ? 'text-terminal-error'
                  : isCorrect
                  ? 'text-terminal-primary'
                  : 'text-terminal-untyped'
              }
            >
              {isCursor && <span className="cursor-caret" aria-hidden="true" />}
              {char}
            </span>
          )
        })}
        {cursorIndex >= chars.length && (
          <span className="cursor-caret" aria-hidden="true" />
        )}
      </pre>
    </div>
  )
}
