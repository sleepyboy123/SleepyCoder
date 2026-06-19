import { Language, Snippet, SnippetProvider } from './types'
import { pythonSnippets } from './data/python'
import { typescriptSnippets } from './data/typescript'
import { cSnippets } from './data/c'
import { cppSnippets } from './data/cpp'
import { javaSnippets } from './data/java'
import { goSnippets } from './data/go'
import { rustSnippets } from './data/rust'
import { bashSnippets } from './data/bash'

const SNIPPET_MAP: Record<Language, Snippet[]> = {
  python: pythonSnippets,
  typescript: typescriptSnippets,
  c: cSnippets,
  cpp: cppSnippets,
  java: javaSnippets,
  go: goSnippets,
  rust: rustSnippets,
  bash: bashSnippets,
}

class StaticSnippetProvider implements SnippetProvider {
  async getSnippet(language: Language, id: string): Promise<Snippet> {
    const snippet = SNIPPET_MAP[language].find((s) => s.id === id)
    if (!snippet) throw new Error(`Snippet ${id} not found for ${language}`)
    return snippet
  }

  async getRandomSnippet(language: Language): Promise<Snippet> {
    const snippets = SNIPPET_MAP[language]
    return snippets[Math.floor(Math.random() * snippets.length)]
  }
}

export const staticProvider = new StaticSnippetProvider()
