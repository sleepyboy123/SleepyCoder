export type Language = 'python' | 'typescript' | 'c' | 'cpp' | 'java' | 'go' | 'rust' | 'bash'

export interface Snippet {
  id: string
  language: Language
  title: string
  code: string
}

export interface SnippetProvider {
  getSnippet(language: Language, id: string): Promise<Snippet>
  getRandomSnippet(language: Language): Promise<Snippet>
  listSnippets(language: Language): Promise<Snippet[]>
}

export const LANGUAGES: Language[] = ['python', 'typescript', 'c', 'cpp', 'java', 'go', 'rust', 'bash']

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'PY',
  typescript: 'TS',
  c: 'C',
  cpp: 'C++',
  java: 'JAVA',
  go: 'GO',
  rust: 'RUST',
  bash: 'BASH',
}
