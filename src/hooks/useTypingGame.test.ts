import { renderHook, act, waitFor } from '@testing-library/react'
import { useTypingGame } from './useTypingGame'
import { Language, Snippet, SnippetProvider } from '../lib/snippets/types'

const makeSnippet = (code: string): Snippet => ({
  id: 'test', language: 'python' as Language, title: 'Test', code,
})

const makeProvider = (code: string): SnippetProvider => ({
  getSnippet: async () => makeSnippet(code),
  getRandomSnippet: async () => makeSnippet(code),
})

test('initial state: cursor at 0, not complete, elapsed 0', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  expect(result.current.cursorIndex).toBe(0)
  expect(result.current.isComplete).toBe(false)
  expect(result.current.elapsedMs).toBe(0)
})

test('correct character advances cursor, no error', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  expect(result.current.cursorIndex).toBe(1)
  expect(result.current.errors.size).toBe(0)
})

test('wrong character marks error and advances cursor', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'x' })))
  expect(result.current.cursorIndex).toBe(1)
  expect(result.current.errors.has(0)).toBe(true)
})

test('backspace decrements cursor and clears error', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'x' })))
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'Backspace' })))
  expect(result.current.cursorIndex).toBe(0)
  expect(result.current.errors.has(0)).toBe(false)
})

test('backspace at position 0 does nothing', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'Backspace' })))
  expect(result.current.cursorIndex).toBe(0)
})

test('tab advances cursor by 4, marks non-space positions as errors', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('    xyz')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'Tab' })))
  expect(result.current.cursorIndex).toBe(4)
  expect(result.current.errors.size).toBe(0)
})

test('tab on non-spaces marks 4 errors', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abcd')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'Tab' })))
  expect(result.current.cursorIndex).toBe(4)
  expect(result.current.errors.size).toBe(4)
})

test('enter matches newline character', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('a\nb')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'Enter' })))
  expect(result.current.cursorIndex).toBe(2)
  expect(result.current.errors.size).toBe(0)
})

test('isComplete when all characters typed', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('ab')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'b' })))
  expect(result.current.isComplete).toBe(true)
})

test('no keypresses accepted after completion', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('a')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'b' })))
  expect(result.current.cursorIndex).toBe(1)
})

test('wpm is 0 before first keypress', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  expect(result.current.wpm).toBe(0)
})

test('accuracy is 100 before first keypress', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  expect(result.current.accuracy).toBe(100)
})

test('accuracy is 50 after 1 correct and 1 error', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('ab')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'x' })))
  expect(result.current.accuracy).toBe(50)
})

test('reset restores state for the same snippet', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('ab')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.reset())
  expect(result.current.cursorIndex).toBe(0)
  expect(result.current.errors.size).toBe(0)
  expect(result.current.isComplete).toBe(false)
})

test('setLanguage resets state and loads new snippet', async () => {
  const { result } = renderHook(() => useTypingGame('python', makeProvider('abc')))
  await waitFor(() => expect(result.current.snippet).not.toBeNull())
  act(() => result.current.handleKeyDown(new KeyboardEvent('keydown', { key: 'a' })))
  act(() => result.current.setLanguage('typescript'))
  await waitFor(() => expect(result.current.language).toBe('typescript'))
  expect(result.current.cursorIndex).toBe(0)
})
