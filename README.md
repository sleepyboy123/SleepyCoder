# Sleepy Coder

A code typing game for developers. Pick a language, type real educational code snippets — Tower of Hanoi, merge sort, binary search, sudoku solver — and get your WPM and accuracy when you finish. The vibe is cyberpunk terminal, not a productivity tool.

## Getting Started

```bash
npm install
npm start       # dev server at localhost:3000
npm test        # run the test suite
npm run build   # production build
```

---

## Project Structure

```
sleepy_coder/
├── public/
├── src/
│   ├── App.tsx                         # Root — wires keyboard listener, passes state to layout
│   ├── index.tsx                       # React entry point
│   ├── index.css                       # Tailwind directives, scanlines, cursor blink, custom scrollbar
│   │
│   ├── components/
│   │   ├── Header.tsx                  # Title bar + live WPM / accuracy counters
│   │   ├── Sidebar.tsx                 # VSCode-style file explorer — language folders + snippet files + RND button
│   │   ├── GameBar.tsx                 # Elapsed timer, progress bar, reset button
│   │   ├── TypingArea.tsx              # Conditional router: loading → SnippetDisplay → ResultCard
│   │   ├── SnippetDisplay.tsx          # Character-level highlighted code + blinking cursor
│   │   └── ResultCard.tsx             # End screen: WPM, accuracy, time + play-again buttons
│   │
│   ├── hooks/
│   │   ├── useTypingGame.ts            # All game logic and state
│   │   └── useTypingGame.test.ts       # 15 unit tests (TDD)
│   │
│   └── lib/
│       └── snippets/
│           ├── types.ts                # Language, Snippet, SnippetProvider interface
│           ├── staticProvider.ts       # Static implementation of SnippetProvider
│           └── data/
│               ├── python.ts           # 10 Python snippets
│               ├── typescript.ts       # 10 TypeScript snippets
│               ├── c.ts               # 10 C snippets
│               ├── cpp.ts             # 10 C++ snippets
│               ├── java.ts            # 10 Java snippets
│               ├── go.ts              # 10 Go snippets
│               ├── rust.ts            # 10 Rust snippets
│               └── bash.ts            # 10 Bash snippets
│
├── tailwind.config.js                  # Custom color tokens, font, glow shadows
├── tsconfig.json
└── package.json
```

---

## Folder Breakdown

### `src/components/`

Pure presentational components. None of them own state — they receive props from `App.tsx` and render.

| Component | Responsibility |
|---|---|
| `Header` | App title + live WPM/accuracy. Shows `--` before the first keypress. |
| `Sidebar` | VSCode-style file explorer. Language folders expand/collapse to reveal individual snippet files. Clicking a file loads that specific snippet. RND button at the top picks a random language and snippet. Folder open state is local to Sidebar. |
| `GameBar` | Stopwatch (updates every 100ms), gradient progress bar, and a RST button. |
| `TypingArea` | Decides what to render based on game state: a loading spinner, the `SnippetDisplay`, or the `ResultCard` on completion. |
| `SnippetDisplay` | Splits the snippet's code string into individual character spans — correct chars in purple, errors in red/pink, untyped in dim. Renders a `↵` hint before every newline. The blinking cursor is a `cursor-caret` span injected at `cursorIndex`. |
| `ResultCard` | Shown on snippet completion. Displays WPM, accuracy, elapsed time in large terminal text. Two buttons: play again (same snippet) and new snippet. |

### `src/hooks/`

`useTypingGame` is the entire game engine. It owns all mutable state and exposes a stable API to `App.tsx`.

Returns:

```ts
{
  snippet, cursorIndex, errors, elapsedMs,
  isComplete, isLoading, wpm, accuracy, language,
  handleKeyDown, setLanguage, reset, newSnippet,
  loadSpecificSnippet, loadRandom
}
```

- `loadSpecificSnippet(language, id)` — loads a named snippet by ID; used by Sidebar file clicks.
- `loadRandom()` — picks a random language then a random snippet from it; used by the RND button.

`handleKeyDown` is a stable callback (safe to attach to `window` once) — it reads current state via a `stateRef` rather than closing over state values directly. This avoids the stale-closure problem on the global keyboard listener.

### `src/lib/snippets/`

The data layer. Three layers:

1. **`types.ts`** — defines `Language`, `Snippet`, and the `SnippetProvider` interface. This is the AI swap seam (see Architecture below).
2. **`staticProvider.ts`** — implements `SnippetProvider` backed by the static snippet arrays. Exported as a singleton `staticProvider`.
3. **`data/*.ts`** — 10 snippets per language (80 total). Topics: Tower of Hanoi, fibonacci, binary search, merge sort, quicksort, sieve of Eratosthenes, linked list, BST insert, GCD, sudoku solver — educational algorithms implemented in each language's idiom.

---

## Architecture and Key Design Decisions

### SnippetProvider as the AI swap seam

The `SnippetProvider` interface is intentionally the only coupling point between the game engine and the snippet source:

```ts
interface SnippetProvider {
  getSnippet(language: Language, id: string): Promise<Snippet>
  getRandomSnippet(language: Language): Promise<Snippet>
  listSnippets(language: Language): Promise<Snippet[]>
}
```

`useTypingGame` accepts a `provider` parameter (defaults to `staticProvider`). Swapping to an AI-generated backend requires only implementing this three-method interface — no changes to the hook, components, or anything else.

### stateRef pattern — stable keyboard listener

`handleKeyDown` is attached to `window` in `App.tsx`. If `handleKeyDown` closed directly over React state, it would go stale — the listener would always see the state from the render it was created in.

The solution: a `stateRef` that stays in sync with state via `useEffect`, and `handleKeyDown` reads from `stateRef.current` instead of the closed-over values. This keeps `handleKeyDown` a stable reference that only re-creates when `startTimer`/`stopTimer` change (effectively once on mount).

### Race guard on snippet loading

Rapid language switching could cause a slow async fetch to overwrite a newer result. A generation counter prevents this:

```ts
const gen = ++loadGenRef.current
const snippet = await provider.getRandomSnippet(lang)
if (gen !== loadGenRef.current) return // stale — discard
```

### Permissive typing mode

Wrong characters are allowed — the cursor still advances, and the incorrect positions are tracked in an `errors: Map<number, string>` (key = position, value = what was typed). The display shows the typed character in red rather than the original, so what you see matches what you pressed. Backspace removes the last character (and clears its error entry). The snippet is complete only when `cursorIndex >= snippet.code.length`, regardless of error count.

### Tab and Enter handling

Snippets use spaces for indentation (no tab characters). Pressing Tab fires 4 virtual space keypresses — each is checked individually against the snippet code, so Tab on a non-space line marks errors. Pressing Enter is mapped to `'\n'` and matched against newline characters in the snippet.

### WPM and accuracy formulas

- **WPM:** `(cursorIndex / 5) / (elapsedMs / 60000)` — standard 5-chars-per-word definition, computed live on every render.
- **Accuracy:** `((cursorIndex - errors.size) / cursorIndex) * 100` — fraction of positions typed correctly. Backspace clears the error entry, so fixing a mistake improves accuracy.

### Stateless by design

No `localStorage`, no user accounts, no persistence. Every page load starts fresh. State lives entirely in `useTypingGame` and resets on snippet load, language switch, or the RST button.

### Styling

- **Tailwind CSS** for layout and utility classes. Custom color tokens (`terminal-bg`, `terminal-primary`, `terminal-error`, etc.) defined once in `tailwind.config.js`.
- **Cyberpunk purple palette:** background `#0a0010`, primary/correct `#c084fc`, errors `#ff4d8b`, accent `#bf00ff`.
- **Scanlines** via a `body::after` repeating-linear-gradient overlay in `index.css`.
- **Cursor blink** via a CSS `@keyframes` animation on the `.cursor-caret` class.
- **JetBrains Mono** as the monospace font throughout.
