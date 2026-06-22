import { useState, useEffect, useCallback, useRef } from 'react'
import { Language, LANGUAGES, Snippet, SnippetProvider } from '../lib/snippets/types'
import { staticProvider } from '../lib/snippets/staticProvider'

interface GameState {
  snippet: Snippet | null
  cursorIndex: number
  errors: Map<number, string>
  totalErrors: number
  startTime: number | null
  isComplete: boolean
}

export function useTypingGame(
  initialLanguage: Language = 'python',
  provider: SnippetProvider = staticProvider
) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [isLoading, setIsLoading] = useState(true)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [state, setState] = useState<GameState>({
    snippet: null,
    cursorIndex: 0,
    errors: new Map(),
    totalErrors: 0,
    startTime: null,
    isComplete: false,
  })

  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const loadGenRef = useRef(0)
  const skipNextLoadRef = useRef(false)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback((startTime: number) => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime)
    }, 100)
  }, [stopTimer])

  const loadSnippet = useCallback(async (lang: Language) => {
    setIsLoading(true)
    const gen = ++loadGenRef.current
    const snippet = await provider.getRandomSnippet(lang)
    if (gen !== loadGenRef.current) return // stale — a newer load is in flight
    stopTimer()
    setElapsedMs(0)
    setState({ snippet, cursorIndex: 0, errors: new Map(), totalErrors: 0, startTime: null, isComplete: false })
    setIsLoading(false)
  }, [provider, stopTimer])

  useEffect(() => {
    if (skipNextLoadRef.current) {
      skipNextLoadRef.current = false
      return
    }
    loadSnippet(language)
    return () => stopTimer()
  }, [language, loadSnippet, stopTimer])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { snippet, isComplete } = stateRef.current
    if (!snippet || isComplete) return

    const { key } = e

    if (key === 'Tab') {
      e.preventDefault()
      setState((prev) => {
        const keysToProcess = Math.min(4, snippet.code.length - prev.cursorIndex)
        if (keysToProcess <= 0) return prev
        const newErrors = new Map(prev.errors)
        let newIndex = prev.cursorIndex
        let newTotalErrors = prev.totalErrors
        const newStartTime = prev.startTime ?? Date.now()
        for (let i = 0; i < keysToProcess; i++) {
          if (snippet.code[newIndex] !== ' ') { newErrors.set(newIndex, ' '); newTotalErrors++ }
          newIndex++
        }
        const isComplete = newIndex >= snippet.code.length
        if (isComplete) stopTimer()
        else if (!prev.startTime) startTimer(newStartTime)
        return { ...prev, cursorIndex: newIndex, errors: newErrors, totalErrors: newTotalErrors, startTime: newStartTime, isComplete }
      })
      return
    }

    if (key === 'Backspace') {
      e.preventDefault()
      setState((prev) => {
        if (prev.cursorIndex === 0) return prev
        const newErrors = new Map(prev.errors)
        newErrors.delete(prev.cursorIndex - 1)
        return { ...prev, cursorIndex: prev.cursorIndex - 1, errors: newErrors }
      })
      return
    }

    let typed: string | null = null
    if (key === 'Enter') typed = '\n'
    else if (key.length === 1) typed = key

    if (typed === null) return

    e.preventDefault()
    setState((prev) => {
      if (prev.cursorIndex >= snippet.code.length) return prev
      const newErrors = new Map(prev.errors)
      const newStartTime = prev.startTime ?? Date.now()
      const isWrong = typed !== snippet.code[prev.cursorIndex]
      if (isWrong) newErrors.set(prev.cursorIndex, typed!)
      const newIndex = prev.cursorIndex + 1
      const isComplete = newIndex >= snippet.code.length
      if (isComplete) stopTimer()
      else if (!prev.startTime) startTimer(newStartTime)
      return { ...prev, cursorIndex: newIndex, errors: newErrors, totalErrors: prev.totalErrors + (isWrong ? 1 : 0), startTime: newStartTime, isComplete }
    })
  }, [startTimer, stopTimer])

  const reset = useCallback(() => {
    stopTimer()
    setElapsedMs(0)
    setState((prev) => ({
      ...prev,
      cursorIndex: 0,
      errors: new Map(),
      totalErrors: 0,
      startTime: null,
      isComplete: false,
    }))
  }, [stopTimer])

  const newSnippet = useCallback(() => {
    loadSnippet(language)
  }, [language, loadSnippet])

  const loadSpecificSnippet = useCallback(async (lang: Language, id: string) => {
    setIsLoading(true)
    const gen = ++loadGenRef.current
    const snippet = await provider.getSnippet(lang, id)
    if (gen !== loadGenRef.current) return
    stopTimer()
    setElapsedMs(0)
    setState({ snippet, cursorIndex: 0, errors: new Map(), totalErrors: 0, startTime: null, isComplete: false })
    skipNextLoadRef.current = true
    setLanguageState(lang)
    setIsLoading(false)
  }, [provider, stopTimer])

  const loadRandom = useCallback(async () => {
    const randomLang = LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)]
    setIsLoading(true)
    const gen = ++loadGenRef.current
    const snippet = await provider.getRandomSnippet(randomLang)
    if (gen !== loadGenRef.current) return
    stopTimer()
    setElapsedMs(0)
    setState({ snippet, cursorIndex: 0, errors: new Map(), totalErrors: 0, startTime: null, isComplete: false })
    skipNextLoadRef.current = true
    setLanguageState(randomLang)
    setIsLoading(false)
  }, [provider, stopTimer])

  const setLanguage = useCallback((lang: Language) => {
    stopTimer()
    setElapsedMs(0)
    setState((prev) => ({
      ...prev,
      cursorIndex: 0,
      errors: new Map(),
      totalErrors: 0,
      startTime: null,
      isComplete: false,
    }))
    setLanguageState(lang)
  }, [stopTimer])

  const wpm = state.cursorIndex > 0 && elapsedMs > 0
    ? Math.round((state.cursorIndex / 5) / (elapsedMs / 60000))
    : 0

  const accuracy = state.cursorIndex > 0
    ? Math.max(0, Math.round(((state.cursorIndex - state.totalErrors) / state.cursorIndex) * 100))
    : 100

  return {
    snippet: state.snippet,
    cursorIndex: state.cursorIndex,
    errors: state.errors,
    elapsedMs,
    isComplete: state.isComplete,
    isLoading,
    wpm,
    accuracy,
    language,
    handleKeyDown,
    setLanguage,
    loadSpecificSnippet,
    loadRandom,
    reset,
    newSnippet,
  }
}
