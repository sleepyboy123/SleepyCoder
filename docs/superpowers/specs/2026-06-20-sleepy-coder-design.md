# Sleepy Coder — Design Spec
**Date:** 2026-06-20  
**Status:** Approved

---

## Overview

A single-page code typing game where players type real code snippets to practice language syntax and internalize algorithms. Educational focus — snippets are drawn from classic CS problems (recursion, sorting, dynamic programming, tower of hanoi, sudoku solver, etc.) to teach "vibe coders" how real code is actually written.

---

## Tech Stack

- **Framework:** React 19 + TypeScript (functional components only)
- **Styling:** Tailwind CSS
- **Base:** Existing CRA scaffold (need to add TypeScript + Tailwind)
- **No backend.** Fully client-side. No auth, no persistence.

---

## Visual Design

### Theme: Cyberpunk Purple Terminal

A purple CRT phosphor monitor aesthetic with gamey touches.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0010` | Page background — near-black with purple undertone |
| Primary text | `#c084fc` | Correct typed chars, labels, UI text |
| Untyped text | `#4a3a5e` | Snippet chars not yet reached |
| Error text | `#ff4d8b` | Hot pink-red for wrong characters |
| Accent / glow | `#bf00ff` | Borders, cursor, progress bar, active elements |
| Progress fill | `#7c3aed` → `#c084fc` | Gradient on progress bar |
| Surface | `#12002a` | Card / panel backgrounds |

**Typography:** `JetBrains Mono` (primary, Google Fonts), fallback `Fira Code`, `monospace`. All text monospace — no sans-serif anywhere.

**Effects:**
- Subtle CSS scanline overlay on the background (repeating linear gradient, ~2px rows, 5% opacity)
- `box-shadow: 0 0 8px #bf00ff` glow on focused/active elements
- Blinking `█` block cursor at the current typing position (CSS animation, 1s blink)
- `↵` hint rendered at end of each line to indicate Enter is required

---

## Layout

Single-page, full-viewport. Four horizontal bands stacked top-to-bottom:

```
┌──────────────────────────────────────────────────────┐
│  > SLEEPY_CODER.exe          [WPM: 87] [ACC: 94%]    │  ← Header
├──────────────────────────────────────────────────────┤
│  [PY] [TS] [C] [C++] [JAVA] [GO] [RUST] [BASH]      │  ← Language selector
├──────────────────────────────────────────────────────┤
│  TIME: 01:23  [████████████░░░░░░░]  [RESET]         │  ← Game bar
├──────────────────────────────────────────────────────┤
│                                                      │
│  # tower_of_hanoi.py                                 │
│                                                      │
│  def hanoi(n, src, dst, aux):                        │  ← Typing area
│      if n == 1:                                      │     (or Result card)
│          ...                                         │
│                                                      │
└──────────────────────────────────────────────────────┘
```

On completion, the typing area is replaced inline with a **Result Card** — no modal, no screen change.

---

## Component Architecture

```
App.tsx
├── Header.tsx              — app title + live WPM + accuracy
├── LanguageSelector.tsx    — 8 language pill tabs
├── GameBar.tsx             — stopwatch timer, progress bar, reset button
└── TypingArea.tsx          — conditionally renders:
    ├── SnippetDisplay.tsx  — character-level highlighted code + blinking cursor
    └── ResultCard.tsx      — final stats + action buttons

hooks/
└── useTypingGame.ts        — all game state and logic

lib/snippets/
├── types.ts                — Snippet, Language types + SnippetProvider interface
├── staticProvider.ts       — SnippetProvider implementation using bundled data
└── data/
    ├── python.ts
    ├── typescript.ts
    ├── c.ts
    ├── cpp.ts
    ├── java.ts
    ├── go.ts
    ├── rust.ts
    └── bash.ts
```

### SnippetProvider Interface (AI swap point)

```typescript
interface Snippet {
  id: string
  language: Language
  title: string         // e.g. "Tower of Hanoi"
  code: string          // raw code with real \n and spaces
}

interface SnippetProvider {
  getSnippet(language: Language): Promise<Snippet>
  getRandomSnippet(language: Language): Promise<Snippet>
}
```

`staticProvider.ts` implements this interface. Swapping to an AI provider later requires only implementing the same interface and passing it to the game — no component changes needed.

---

## Snippet Library

**8 languages:** Python, TypeScript, C, C++, Java, Go, Rust, Bash  
**~10–15 snippets per language** (~100 snippets total)

### Snippet categories (shared across languages):
- Recursion: fibonacci, factorial, power
- Classic puzzles: Tower of Hanoi, N-Queens
- Sorting: merge sort, quicksort, bubble sort
- Search: binary search
- Dynamic programming: knapsack, longest common subsequence
- Data structures: linked list operations, stack/queue, binary tree traversal
- Math: sieve of Eratosthenes, GCD/LCM, prime check
- Puzzles: Sudoku solver, FizzBuzz (idiomatic per language)

Snippets are stored as raw strings with real whitespace. Indentation uses **spaces** (not tabs) consistently across all languages, even languages that conventionally use tabs (Go, Makefile-style Bash).

---

## Typing Engine — `useTypingGame`

### State

```typescript
interface TypingGameState {
  snippet: Snippet | null
  cursorIndex: number        // current position in snippet.code
  errors: Set<number>        // indices where a wrong char was typed
  startTime: number | null   // timestamp of first keypress
  elapsedMs: number          // updated every 100ms while playing
  isComplete: boolean
  language: Language
}
```

### Key Handling

| Key | Behaviour |
|-----|-----------|
| Printable char | If matches `snippet.code[cursorIndex]` → advance cursor. If not → add to `errors`, advance anyway |
| Enter | Matches `\n` in snippet — same correct/error logic |
| Tab | Treated as exactly 4 Space keypresses processed in sequence. Each of the 4 positions is matched against the snippet character — correct if snippet has a space there, error otherwise |
| Backspace | Decrement `cursorIndex`. Remove that index from `errors` |
| All other keys | Ignored |

### Derived Values

**WPM** (live, recalculated every second after first keypress):
```
WPM = (cursorIndex / 5) / (elapsedMs / 60000)
```

**Accuracy** (shown in header live, final value on result card):
```
accuracy = ((cursorIndex - errors.size) / cursorIndex) * 100
```

**Progress** (drives progress bar):
```
progress = cursorIndex / snippet.code.length   // 0.0 → 1.0
```

**Completion:** `cursorIndex >= snippet.code.length` — timer stops, result card renders.

### Lifecycle

1. App loads → `staticProvider.getRandomSnippet(defaultLanguage)` called
2. First keypress → `startTime` set, timer starts
3. Language tab clicked → new snippet loaded, state reset (timer stops and clears)
4. Reset button clicked → same snippet reloaded, state reset
5. Snippet complete → timer stops, `isComplete = true`, ResultCard renders
6. "Play Again" → same snippet, state reset
7. "New Snippet" → new random snippet for current language, state reset

---

## Result Card

Shown inline in the typing area on completion. Contains:

- **WPM** — large display number
- **Accuracy** — percentage
- **Time** — elapsed time formatted as `MM:SS`
- **[PLAY AGAIN]** — same snippet, reset state
- **[NEW SNIPPET]** — new random snippet, same language

No scores saved. Stateless.

---

## SnippetDisplay Rendering

The snippet code string is split character-by-character. Each character renders as a `<span>` with one of three states:

| State | Condition | Style |
|-------|-----------|-------|
| Correct | `i < cursorIndex && !errors.has(i)` | `#c084fc` bright purple |
| Error | `errors.has(i)` | `#ff4d8b` hot pink-red |
| Untyped | `i > cursorIndex` | `#4a3a5e` dim purple-grey |
| Cursor | `i === cursorIndex` | Blinking `█` block cursor overlay |

Newline characters render as invisible but push subsequent characters to the next line. A `↵` glyph is rendered at the end of each line (before `\n`) in a dim colour to indicate Enter is required.

Indentation is always stored as spaces. Tab key = 4 space keypresses. Coders who prefer spaces and coders who prefer tabs both work naturally — pressing Tab just fires 4 space matches at once.

---

## What's Out of Scope

- Leaderboard or score persistence
- Multiple game modes (timed, word count)
- AI snippet generation (interface is ready, implementation is not in this phase)
- Authentication
- Sound effects
- Mobile / touch support
- Difficulty levels
