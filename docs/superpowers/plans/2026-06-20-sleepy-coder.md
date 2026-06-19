# Sleepy Coder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page code typing game where players type educational code snippets in a cyberpunk purple terminal aesthetic.

**Architecture:** Single page with four stacked bands (header, language selector, game bar, typing area). All game logic in `useTypingGame` hook; components are purely presentational. Snippet data served by a `SnippetProvider` interface — static now, AI-swappable later.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, JetBrains Mono (Google Fonts), Jest + React Testing Library (CRA built-in)

## Global Constraints

- Functional components only — no class components
- All styling via Tailwind utility classes; custom effects (scanlines, glow, cursor blink) in `src/index.css`
- Colors: bg `#0a0010`, primary/correct `#c084fc`, untyped `#4a3a5e`, error `#ff4d8b`, accent `#bf00ff`, surface `#12002a`
- Font: JetBrains Mono everywhere — no sans-serif
- Tab key = 4 space keypresses; all snippet indentation uses spaces
- Stateless — no localStorage, no persistence, no network calls

---

### Task 1: Project Setup — TypeScript, Tailwind, Fonts

**Files:**
- Modify: `package.json` (deps added via npm)
- Create: `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`
- Create: `src/App.tsx`, `src/index.tsx`
- Delete: `src/App.js`, `src/index.js`, `src/App.css`, `src/logo.svg`, `src/App.test.js`

**Interfaces:**
- Produces: Working React + TypeScript + Tailwind app that starts without errors

- [ ] **Step 1: Install TypeScript dependencies**

```bash
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

- [ ] **Step 2: Install Tailwind CSS**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Expected: `tailwind.config.js` and `postcss.config.js` created in project root.

- [ ] **Step 3: Replace tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0010',
          surface: '#12002a',
          primary: '#c084fc',
          untyped: '#4a3a5e',
          error: '#ff4d8b',
          accent: '#bf00ff',
          border: '#3d1a52',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 8px #bf00ff',
        'glow-sm': '0 0 4px #bf00ff',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Replace src/index.css entirely**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    box-sizing: border-box;
  }
  body {
    background-color: #0a0010;
    color: #c084fc;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #12002a; }
  ::-webkit-scrollbar-thumb { background: #3d1a52; border-radius: 3px; }
}

body::after {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent, transparent 2px,
    rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor-caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background-color: #bf00ff;
  margin-right: 1px;
  vertical-align: text-bottom;
  animation: cursor-blink 1s step-end infinite;
  box-shadow: 0 0 6px #bf00ff;
}
```

- [ ] **Step 6: Delete boilerplate files**

Delete: `src/App.js`, `src/index.js`, `src/App.css`, `src/logo.svg`, `src/App.test.js`

- [ ] **Step 7: Create src/App.tsx**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-primary flex items-center justify-center font-mono">
      <p className="text-terminal-accent animate-pulse">{'> SLEEPY_CODER.exe loading...'}</p>
    </div>
  )
}
```

- [ ] **Step 8: Create src/index.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 9: Verify the app starts**

```bash
npm start
```

Expected: Browser shows `> SLEEPY_CODER.exe loading...` in purple on dark background. No errors in console.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: add TypeScript, Tailwind, fonts, scanline styles"
```

---

### Task 2: Snippet Data Layer

**Files:**
- Create: `src/lib/snippets/types.ts`
- Create: `src/lib/snippets/data/python.ts`
- Create: `src/lib/snippets/data/typescript.ts`
- Create: `src/lib/snippets/data/c.ts`
- Create: `src/lib/snippets/data/cpp.ts`
- Create: `src/lib/snippets/data/java.ts`
- Create: `src/lib/snippets/data/go.ts`
- Create: `src/lib/snippets/data/rust.ts`
- Create: `src/lib/snippets/data/bash.ts`
- Create: `src/lib/snippets/staticProvider.ts`

**Interfaces:**
- Produces: `SnippetProvider` interface, `staticProvider` singleton, `LANGUAGES`, `LANGUAGE_LABELS`

- [ ] **Step 1: Create src/lib/snippets/types.ts**

```typescript
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
```

- [ ] **Step 2: Create src/lib/snippets/data/python.ts**

```typescript
import { Snippet } from '../types'

export const pythonSnippets: Snippet[] = [
  {
    id: 'py-hanoi',
    language: 'python',
    title: 'Tower of Hanoi',
    code: `def hanoi(n, source, target, aux):
    if n == 1:
        print(f"Move disk 1 from {source} to {target}")
        return
    hanoi(n - 1, source, aux, target)
    print(f"Move disk {n} from {source} to {target}")
    hanoi(n - 1, aux, target, source)`,
  },
  {
    id: 'py-fibonacci',
    language: 'python',
    title: 'Fibonacci (Recursive)',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def fibonacci_sequence(count):
    return [fibonacci(i) for i in range(count)]`,
  },
  {
    id: 'py-binary-search',
    language: 'python',
    title: 'Binary Search',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: 'py-merge-sort',
    language: 'python',
    title: 'Merge Sort',
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    return result + left[i:] + right[j:]`,
  },
  {
    id: 'py-sieve',
    language: 'python',
    title: 'Sieve of Eratosthenes',
    code: `def sieve_of_eratosthenes(n):
    primes = [True] * (n + 1)
    primes[0] = primes[1] = False
    for i in range(2, int(n ** 0.5) + 1):
        if primes[i]:
            for j in range(i * i, n + 1, i):
                primes[j] = False
    return [i for i in range(n + 1) if primes[i]]`,
  },
  {
    id: 'py-quicksort',
    language: 'python',
    title: 'Quick Sort',
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
  },
  {
    id: 'py-linked-list',
    language: 'python',
    title: 'Linked List',
    code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        node = Node(data)
        if not self.head:
            self.head = node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = node`,
  },
  {
    id: 'py-bst',
    language: 'python',
    title: 'Binary Search Tree',
    code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if root is None:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val)
        inorder(root.right)`,
  },
  {
    id: 'py-gcd',
    language: 'python',
    title: 'GCD and LCM',
    code: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def lcm(a, b):
    return abs(a * b) // gcd(a, b)`,
  },
  {
    id: 'py-sudoku',
    language: 'python',
    title: 'Sudoku Solver',
    code: `def is_valid(board, row, col, num):
    for i in range(9):
        if board[row][i] == num or board[i][col] == num:
            return False
    box_row, box_col = 3 * (row // 3), 3 * (col // 3)
    for i in range(3):
        for j in range(3):
            if board[box_row + i][box_col + j] == num:
                return False
    return True

def solve(board):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                for num in range(1, 10):
                    if is_valid(board, row, col, num):
                        board[row][col] = num
                        if solve(board):
                            return True
                        board[row][col] = 0
                return False
    return True`,
  },
]
```

- [ ] **Step 3: Create src/lib/snippets/data/typescript.ts**

```typescript
import { Snippet } from '../types'

export const typescriptSnippets: Snippet[] = [
  {
    id: 'ts-binary-search',
    language: 'typescript',
    title: 'Binary Search',
    code: `function binarySearch(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 'ts-merge-sort',
    language: 'typescript',
    title: 'Merge Sort',
    code: `function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  },
  {
    id: 'ts-stack',
    language: 'typescript',
    title: 'Generic Stack',
    code: `class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}`,
  },
  {
    id: 'ts-fibonacci-memo',
    language: 'typescript',
    title: 'Fibonacci (Memoized)',
    code: `function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    memo.set(n, result);
    return result;
}`,
  },
  {
    id: 'ts-debounce',
    language: 'typescript',
    title: 'Debounce',
    code: `function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}`,
  },
  {
    id: 'ts-deep-clone',
    language: 'typescript',
    title: 'Deep Clone',
    code: `function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
    const clone = {} as T;
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key]);
        }
    }
    return clone;
}`,
  },
  {
    id: 'ts-hanoi',
    language: 'typescript',
    title: 'Tower of Hanoi',
    code: `function hanoi(
    n: number,
    source: string,
    target: string,
    aux: string
): void {
    if (n === 1) {
        console.log(\`Move disk 1 from \${source} to \${target}\`);
        return;
    }
    hanoi(n - 1, source, aux, target);
    console.log(\`Move disk \${n} from \${source} to \${target}\`);
    hanoi(n - 1, aux, target, source);
}`,
  },
  {
    id: 'ts-queue',
    language: 'typescript',
    title: 'Generic Queue',
    code: `class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    front(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}`,
  },
  {
    id: 'ts-flatten',
    language: 'typescript',
    title: 'Flatten Array (Recursive)',
    code: `function flatten<T>(arr: (T | T[])[]): T[] {
    return arr.reduce<T[]>((acc, val) => {
        if (Array.isArray(val)) {
            return acc.concat(flatten(val));
        }
        return acc.concat(val);
    }, []);
}`,
  },
  {
    id: 'ts-power',
    language: 'typescript',
    title: 'Fast Power',
    code: `function power(base: number, exp: number): number {
    if (exp === 0) return 1;
    if (exp % 2 === 0) {
        const half = power(base, exp / 2);
        return half * half;
    }
    return base * power(base, exp - 1);
}`,
  },
]
```

- [ ] **Step 4: Create src/lib/snippets/data/c.ts**

```typescript
import { Snippet } from '../types'

export const cSnippets: Snippet[] = [
  {
    id: 'c-fibonacci',
    language: 'c',
    title: 'Fibonacci (Recursive)',
    code: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    id: 'c-binary-search',
    language: 'c',
    title: 'Binary Search',
    code: `int binary_search(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 'c-hanoi',
    language: 'c',
    title: 'Tower of Hanoi',
    code: `void hanoi(int n, char source, char target, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", source, target);
        return;
    }
    hanoi(n - 1, source, aux, target);
    printf("Move disk %d from %c to %c\\n", n, source, target);
    hanoi(n - 1, aux, target, source);
}`,
  },
  {
    id: 'c-bubble-sort',
    language: 'c',
    title: 'Bubble Sort',
    code: `void bubble_sort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
  },
  {
    id: 'c-factorial',
    language: 'c',
    title: 'Factorial',
    code: `unsigned long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
  },
  {
    id: 'c-sieve',
    language: 'c',
    title: 'Sieve of Eratosthenes',
    code: `void sieve(int n, int primes[], int *count) {
    int is_prime[n + 1];
    for (int i = 0; i <= n; i++) is_prime[i] = 1;
    is_prime[0] = is_prime[1] = 0;
    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i])
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = 0;
    }
    *count = 0;
    for (int i = 2; i <= n; i++)
        if (is_prime[i]) primes[(*count)++] = i;
}`,
  },
  {
    id: 'c-gcd',
    language: 'c',
    title: 'GCD (Euclidean)',
    code: `int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}`,
  },
  {
    id: 'c-reverse-string',
    language: 'c',
    title: 'Reverse String',
    code: `void reverse_string(char str[], int len) {
    int left = 0, right = len - 1;
    while (left < right) {
        char temp = str[left];
        str[left] = str[right];
        str[right] = temp;
        left++;
        right--;
    }
}`,
  },
  {
    id: 'c-linked-list',
    language: 'c',
    title: 'Linked List',
    code: `struct Node {
    int data;
    struct Node *next;
};

struct Node *create_node(int data) {
    struct Node *node = malloc(sizeof(struct Node));
    node->data = data;
    node->next = NULL;
    return node;
}

void append(struct Node **head, int data) {
    struct Node *node = create_node(data);
    if (*head == NULL) { *head = node; return; }
    struct Node *cur = *head;
    while (cur->next) cur = cur->next;
    cur->next = node;
}`,
  },
  {
    id: 'c-power',
    language: 'c',
    title: 'Fast Power',
    code: `long long power(long long base, int exp) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        long long half = power(base, exp / 2);
        return half * half;
    }
    return base * power(base, exp - 1);
}`,
  },
]
```

- [ ] **Step 5: Create src/lib/snippets/data/cpp.ts**

```typescript
import { Snippet } from '../types'

export const cppSnippets: Snippet[] = [
  {
    id: 'cpp-binary-search',
    language: 'cpp',
    title: 'Binary Search',
    code: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 'cpp-merge-sort',
    language: 'cpp',
    title: 'Merge Sort',
    code: `void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size())
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < (int)left.size()) arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
  },
  {
    id: 'cpp-stack',
    language: 'cpp',
    title: 'Generic Stack',
    code: `template<typename T>
class Stack {
    vector<T> items;
public:
    void push(T item) { items.push_back(item); }

    T pop() {
        if (isEmpty()) throw runtime_error("Stack is empty");
        T item = items.back();
        items.pop_back();
        return item;
    }

    T peek() const {
        if (isEmpty()) throw runtime_error("Stack is empty");
        return items.back();
    }

    bool isEmpty() const { return items.empty(); }
    int size() const { return items.size(); }
};`,
  },
  {
    id: 'cpp-hanoi',
    language: 'cpp',
    title: 'Tower of Hanoi',
    code: `void hanoi(int n, char source, char target, char aux) {
    if (n == 1) {
        cout << "Move disk 1 from " << source << " to " << target << endl;
        return;
    }
    hanoi(n - 1, source, aux, target);
    cout << "Move disk " << n << " from " << source << " to " << target << endl;
    hanoi(n - 1, aux, target, source);
}`,
  },
  {
    id: 'cpp-quicksort',
    language: 'cpp',
    title: 'Quick Sort',
    code: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  },
  {
    id: 'cpp-bst',
    language: 'cpp',
    title: 'Binary Search Tree',
    code: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}`,
  },
  {
    id: 'cpp-sieve',
    language: 'cpp',
    title: 'Sieve of Eratosthenes',
    code: `vector<int> sieve(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (is_prime[i])
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
    vector<int> primes;
    for (int i = 2; i <= n; i++)
        if (is_prime[i]) primes.push_back(i);
    return primes;
}`,
  },
  {
    id: 'cpp-gcd',
    language: 'cpp',
    title: 'GCD and LCM',
    code: `int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

long long lcm(int a, int b) {
    return (long long)a / gcd(a, b) * b;
}`,
  },
  {
    id: 'cpp-fibonacci-memo',
    language: 'cpp',
    title: 'Fibonacci (Memoized)',
    code: `int fibonacci(int n, unordered_map<int, int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
}`,
  },
  {
    id: 'cpp-power',
    language: 'cpp',
    title: 'Fast Power',
    code: `long long power(long long base, int exp) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        long long half = power(base, exp / 2);
        return half * half;
    }
    return base * power(base, exp - 1);
}`,
  },
]
```

- [ ] **Step 6: Create src/lib/snippets/data/java.ts**

```typescript
import { Snippet } from '../types'

export const javaSnippets: Snippet[] = [
  {
    id: 'java-binary-search',
    language: 'java',
    title: 'Binary Search',
    code: `public static int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
  },
  {
    id: 'java-merge-sort',
    language: 'java',
    title: 'Merge Sort',
    code: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

public static void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
  },
  {
    id: 'java-hanoi',
    language: 'java',
    title: 'Tower of Hanoi',
    code: `public static void hanoi(int n, char source, char target, char aux) {
    if (n == 1) {
        System.out.println("Move disk 1 from " + source + " to " + target);
        return;
    }
    hanoi(n - 1, source, aux, target);
    System.out.println("Move disk " + n + " from " + source + " to " + target);
    hanoi(n - 1, aux, target, source);
}`,
  },
  {
    id: 'java-stack',
    language: 'java',
    title: 'Generic Stack',
    code: `public class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();

    public void push(T item) { items.add(item); }

    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() { return items.isEmpty(); }
    public int size() { return items.size(); }
}`,
  },
  {
    id: 'java-quicksort',
    language: 'java',
    title: 'Quick Sort',
    code: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

public static int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            int temp = arr[++i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,
  },
  {
    id: 'java-sieve',
    language: 'java',
    title: 'Sieve of Eratosthenes',
    code: `public static List<Integer> sieve(int n) {
    boolean[] isPrime = new boolean[n + 1];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (isPrime[i])
            for (int j = i * i; j <= n; j += i)
                isPrime[j] = false;
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++)
        if (isPrime[i]) primes.add(i);
    return primes;
}`,
  },
  {
    id: 'java-bst',
    language: 'java',
    title: 'Binary Search Tree',
    code: `class TreeNode {
    int val; TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public static TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}

public static void inorder(TreeNode root) {
    if (root != null) {
        inorder(root.left);
        System.out.print(root.val + " ");
        inorder(root.right);
    }
}`,
  },
  {
    id: 'java-fibonacci',
    language: 'java',
    title: 'Fibonacci (Memoized)',
    code: `public static long fibonacci(int n, Map<Integer, Long> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    memo.put(n, result);
    return result;
}`,
  },
  {
    id: 'java-gcd',
    language: 'java',
    title: 'GCD and LCM',
    code: `public static int gcd(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

public static long lcm(int a, int b) {
    return (long) a / gcd(a, b) * b;
}`,
  },
  {
    id: 'java-power',
    language: 'java',
    title: 'Fast Power',
    code: `public static long power(long base, int exp) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        long half = power(base, exp / 2);
        return half * half;
    }
    return base * power(base, exp - 1);
}`,
  },
]
```

- [ ] **Step 7: Create src/lib/snippets/data/go.ts**

```typescript
import { Snippet } from '../types'

export const goSnippets: Snippet[] = [
  {
    id: 'go-binary-search',
    language: 'go',
    title: 'Binary Search',
    code: `func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
  },
  {
    id: 'go-merge-sort',
    language: 'go',
    title: 'Merge Sort',
    code: `func mergeSort(arr []int) []int {
    if len(arr) <= 1 {
        return arr
    }
    mid := len(arr) / 2
    left := mergeSort(arr[:mid])
    right := mergeSort(arr[mid:])
    return merge(left, right)
}

func merge(left, right []int) []int {
    result := make([]int, 0, len(left)+len(right))
    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] {
            result = append(result, left[i])
            i++
        } else {
            result = append(result, right[j])
            j++
        }
    }
    return append(append(result, left[i:]...), right[j:]...)
}`,
  },
  {
    id: 'go-hanoi',
    language: 'go',
    title: 'Tower of Hanoi',
    code: `func hanoi(n int, source, target, aux string) {
    if n == 1 {
        fmt.Printf("Move disk 1 from %s to %s\\n", source, target)
        return
    }
    hanoi(n-1, source, aux, target)
    fmt.Printf("Move disk %d from %s to %s\\n", n, source, target)
    hanoi(n-1, aux, target, source)
}`,
  },
  {
    id: 'go-stack',
    language: 'go',
    title: 'Generic Stack',
    code: `type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, bool) {
    var zero T
    if len(s.items) == 0 {
        return zero, false
    }
    item := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return item, true
}

func (s *Stack[T]) IsEmpty() bool {
    return len(s.items) == 0
}`,
  },
  {
    id: 'go-sieve',
    language: 'go',
    title: 'Sieve of Eratosthenes',
    code: `func sieve(n int) []int {
    isPrime := make([]bool, n+1)
    for i := range isPrime {
        isPrime[i] = true
    }
    isPrime[0], isPrime[1] = false, false
    for i := 2; i*i <= n; i++ {
        if isPrime[i] {
            for j := i * i; j <= n; j += i {
                isPrime[j] = false
            }
        }
    }
    primes := []int{}
    for i := 2; i <= n; i++ {
        if isPrime[i] {
            primes = append(primes, i)
        }
    }
    return primes
}`,
  },
  {
    id: 'go-gcd',
    language: 'go',
    title: 'GCD and LCM',
    code: `func gcd(a, b int) int {
    for b != 0 {
        a, b = b, a%b
    }
    return a
}

func lcm(a, b int) int {
    return a / gcd(a, b) * b
}`,
  },
  {
    id: 'go-quicksort',
    language: 'go',
    title: 'Quick Sort',
    code: `func quickSort(arr []int, low, high int) {
    if low < high {
        pi := partition(arr, low, high)
        quickSort(arr, low, pi-1)
        quickSort(arr, pi+1, high)
    }
}

func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    for j := low; j < high; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`,
  },
  {
    id: 'go-fibonacci',
    language: 'go',
    title: 'Fibonacci (Memoized)',
    code: `func fibonacci(n int, memo map[int]int) int {
    if n <= 1 {
        return n
    }
    if val, ok := memo[n]; ok {
        return val
    }
    result := fibonacci(n-1, memo) + fibonacci(n-2, memo)
    memo[n] = result
    return result
}`,
  },
  {
    id: 'go-bst',
    language: 'go',
    title: 'Binary Search Tree',
    code: `type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func insert(root *TreeNode, val int) *TreeNode {
    if root == nil {
        return &TreeNode{Val: val}
    }
    if val < root.Val {
        root.Left = insert(root.Left, val)
    } else {
        root.Right = insert(root.Right, val)
    }
    return root
}`,
  },
  {
    id: 'go-power',
    language: 'go',
    title: 'Fast Power',
    code: `func power(base int64, exp int) int64 {
    if exp == 0 {
        return 1
    }
    if exp%2 == 0 {
        half := power(base, exp/2)
        return half * half
    }
    return base * power(base, exp-1)
}`,
  },
]
```

- [ ] **Step 8: Create src/lib/snippets/data/rust.ts**

```typescript
import { Snippet } from '../types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rust-fibonacci',
    language: 'rust',
    title: 'Fibonacci (Recursive)',
    code: `fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}`,
  },
  {
    id: 'rust-binary-search',
    language: 'rust',
    title: 'Binary Search',
    code: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len();
    while left < right {
        let mid = left + (right - left) / 2;
        match arr[mid].cmp(&target) {
            std::cmp::Ordering::Equal => return Some(mid),
            std::cmp::Ordering::Less => left = mid + 1,
            std::cmp::Ordering::Greater => right = mid,
        }
    }
    None
}`,
  },
  {
    id: 'rust-hanoi',
    language: 'rust',
    title: 'Tower of Hanoi',
    code: `fn hanoi(n: u32, source: char, target: char, aux: char) {
    if n == 1 {
        println!("Move disk 1 from {} to {}", source, target);
        return;
    }
    hanoi(n - 1, source, aux, target);
    println!("Move disk {} from {} to {}", n, source, target);
    hanoi(n - 1, aux, target, source);
}`,
  },
  {
    id: 'rust-merge-sort',
    language: 'rust',
    title: 'Merge Sort',
    code: `fn merge_sort(arr: Vec<i32>) -> Vec<i32> {
    if arr.len() <= 1 { return arr; }
    let mid = arr.len() / 2;
    let left = merge_sort(arr[..mid].to_vec());
    let right = merge_sort(arr[mid..].to_vec());
    merge(left, right)
}

fn merge(left: Vec<i32>, right: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    let (mut i, mut j) = (0, 0);
    while i < left.len() && j < right.len() {
        if left[i] <= right[j] { result.push(left[i]); i += 1; }
        else { result.push(right[j]); j += 1; }
    }
    result.extend_from_slice(&left[i..]);
    result.extend_from_slice(&right[j..]);
    result
}`,
  },
  {
    id: 'rust-stack',
    language: 'rust',
    title: 'Stack Implementation',
    code: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}`,
  },
  {
    id: 'rust-sieve',
    language: 'rust',
    title: 'Sieve of Eratosthenes',
    code: `fn sieve(n: usize) -> Vec<usize> {
    let mut is_prime = vec![true; n + 1];
    if n > 0 { is_prime[0] = false; }
    if n > 1 { is_prime[1] = false; }
    let mut i = 2;
    while i * i <= n {
        if is_prime[i] {
            let mut j = i * i;
            while j <= n { is_prime[j] = false; j += i; }
        }
        i += 1;
    }
    (2..=n).filter(|&i| is_prime[i]).collect()
}`,
  },
  {
    id: 'rust-gcd',
    language: 'rust',
    title: 'GCD and LCM',
    code: `fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let temp = b;
        b = a % b;
        a = temp;
    }
    a
}

fn lcm(a: u64, b: u64) -> u64 {
    a / gcd(a, b) * b
}`,
  },
  {
    id: 'rust-quicksort',
    language: 'rust',
    title: 'Quick Sort',
    code: `fn partition(arr: &mut [i32]) -> usize {
    let high = arr.len() - 1;
    let pivot = arr[high];
    let mut i = 0;
    for j in 0..high {
        if arr[j] <= pivot {
            arr.swap(i, j);
            i += 1;
        }
    }
    arr.swap(i, high);
    i
}

fn quicksort(arr: &mut [i32]) {
    if arr.len() <= 1 { return; }
    let pi = partition(arr);
    quicksort(&mut arr[..pi]);
    quicksort(&mut arr[pi + 1..]);
}`,
  },
  {
    id: 'rust-linked-list',
    language: 'rust',
    title: 'Linked List',
    code: `enum List<T> {
    Cons(T, Box<List<T>>),
    Nil,
}

impl<T> List<T> {
    fn new() -> Self { List::Nil }

    fn push(self, item: T) -> Self {
        List::Cons(item, Box::new(self))
    }

    fn len(&self) -> usize {
        match self {
            List::Nil => 0,
            List::Cons(_, tail) => 1 + tail.len(),
        }
    }
}`,
  },
  {
    id: 'rust-power',
    language: 'rust',
    title: 'Fast Power',
    code: `fn power(base: i64, exp: u32) -> i64 {
    if exp == 0 { return 1; }
    if exp % 2 == 0 {
        let half = power(base, exp / 2);
        half * half
    } else {
        base * power(base, exp - 1)
    }
}`,
  },
]
```

- [ ] **Step 9: Create src/lib/snippets/data/bash.ts**

```typescript
import { Snippet } from '../types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-fibonacci',
    language: 'bash',
    title: 'Fibonacci',
    code: `fibonacci() {
    local n=$1
    if [ "$n" -le 1 ]; then
        echo "$n"
        return
    fi
    local a=$(fibonacci $((n - 1)))
    local b=$(fibonacci $((n - 2)))
    echo $((a + b))
}`,
  },
  {
    id: 'bash-factorial',
    language: 'bash',
    title: 'Factorial',
    code: `factorial() {
    local n=$1
    if [ "$n" -le 1 ]; then
        echo 1
        return
    fi
    local prev=$(factorial $((n - 1)))
    echo $((n * prev))
}`,
  },
  {
    id: 'bash-binary-search',
    language: 'bash',
    title: 'Binary Search',
    code: `binary_search() {
    local -n arr=$1
    local target=$2
    local left=0 right=$((${#arr[@]} - 1))
    while [ $left -le $right ]; do
        local mid=$(( (left + right) / 2 ))
        if [ "${arr[$mid]}" -eq "$target" ]; then
            echo $mid; return
        elif [ "${arr[$mid]}" -lt "$target" ]; then
            left=$((mid + 1))
        else
            right=$((mid - 1))
        fi
    done
    echo -1
}`,
  },
  {
    id: 'bash-bubble-sort',
    language: 'bash',
    title: 'Bubble Sort',
    code: `bubble_sort() {
    local arr=("$@")
    local n=${#arr[@]}
    for ((i = 0; i < n - 1; i++)); do
        for ((j = 0; j < n - i - 1; j++)); do
            if [ "${arr[$j]}" -gt "${arr[$((j + 1))]}" ]; then
                local temp=${arr[$j]}
                arr[$j]=${arr[$((j + 1))]}
                arr[$((j + 1))]=$temp
            fi
        done
    done
    echo "${arr[@]}"
}`,
  },
  {
    id: 'bash-gcd',
    language: 'bash',
    title: 'GCD',
    code: `gcd() {
    local a=$1 b=$2
    while [ "$b" -ne 0 ]; do
        local temp=$b
        b=$((a % b))
        a=$temp
    done
    echo "$a"
}`,
  },
  {
    id: 'bash-is-prime',
    language: 'bash',
    title: 'Prime Check',
    code: `is_prime() {
    local n=$1
    if [ "$n" -lt 2 ]; then echo "false"; return; fi
    local i=2
    while [ $((i * i)) -le "$n" ]; do
        if [ $((n % i)) -eq 0 ]; then
            echo "false"; return
        fi
        i=$((i + 1))
    done
    echo "true"
}`,
  },
  {
    id: 'bash-hanoi',
    language: 'bash',
    title: 'Tower of Hanoi',
    code: `hanoi() {
    local n=$1 source=$2 target=$3 aux=$4
    if [ "$n" -eq 1 ]; then
        echo "Move disk 1 from $source to $target"
        return
    fi
    hanoi $((n - 1)) "$source" "$aux" "$target"
    echo "Move disk $n from $source to $target"
    hanoi $((n - 1)) "$aux" "$target" "$source"
}`,
  },
  {
    id: 'bash-count-lines',
    language: 'bash',
    title: 'Count Lines in Files',
    code: `count_lines() {
    local total=0
    for file in "$@"; do
        if [ -f "$file" ]; then
            local count
            count=$(wc -l < "$file")
            echo "$file: $count lines"
            total=$((total + count))
        else
            echo "$file: not found"
        fi
    done
    echo "Total: $total lines"
}`,
  },
  {
    id: 'bash-backup',
    language: 'bash',
    title: 'Backup Script',
    code: `backup_dir() {
    local source=$1 dest=$2
    local timestamp
    timestamp=$(date +%Y%m%d_%H%M%S)
    if [ ! -d "$source" ]; then
        echo "Source not found: $source"; exit 1
    fi
    mkdir -p "$dest"
    cp -r "$source" "$dest/backup_${timestamp}"
    echo "Backup created: $dest/backup_${timestamp}"
}`,
  },
  {
    id: 'bash-log-parser',
    language: 'bash',
    title: 'Log Parser',
    code: `parse_logs() {
    local log_file=$1 pattern=$2
    if [ ! -f "$log_file" ]; then
        echo "Log file not found"; exit 1
    fi
    local count
    count=$(grep -c "$pattern" "$log_file" 2>/dev/null || echo 0)
    echo "Found $count matches for '$pattern'"
    grep "$pattern" "$log_file" | tail -5
}`,
  },
]
```

- [ ] **Step 10: Create src/lib/snippets/staticProvider.ts**

```typescript
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
```

- [ ] **Step 11: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: add snippet data layer — 80 educational snippets across 8 languages"
```

---

### Task 3: useTypingGame Hook

**Files:**
- Create: `src/hooks/useTypingGame.ts`
- Create: `src/hooks/useTypingGame.test.ts`

**Interfaces:**
- Consumes: `Snippet`, `Language`, `SnippetProvider` from `../lib/snippets/types`; `staticProvider` from `../lib/snippets/staticProvider`
- Produces:
  ```typescript
  useTypingGame(initialLanguage?: Language, provider?: SnippetProvider): {
    snippet: Snippet | null
    cursorIndex: number
    errors: Set<number>
    elapsedMs: number
    isComplete: boolean
    isLoading: boolean
    wpm: number
    accuracy: number
    language: Language
    handleKeyDown: (e: KeyboardEvent) => void
    setLanguage: (lang: Language) => void
    reset: () => void
    newSnippet: () => void
  }
  ```

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useTypingGame.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm test -- --watchAll=false --testPathPattern=useTypingGame
```

Expected: FAIL — `useTypingGame` not found.

- [ ] **Step 3: Implement src/hooks/useTypingGame.ts**

```typescript
import { useState, useEffect, useCallback, useRef } from 'react'
import { Language, Snippet, SnippetProvider } from '../lib/snippets/types'
import { staticProvider } from '../lib/snippets/staticProvider'

interface GameState {
  snippet: Snippet | null
  cursorIndex: number
  errors: Set<number>
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
    errors: new Set(),
    startTime: null,
    isComplete: false,
  })

  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
    const snippet = await provider.getRandomSnippet(lang)
    stopTimer()
    setElapsedMs(0)
    setState({ snippet, cursorIndex: 0, errors: new Set(), startTime: null, isComplete: false })
    setIsLoading(false)
  }, [provider, stopTimer])

  useEffect(() => {
    loadSnippet(language)
    return () => stopTimer()
  }, [language, loadSnippet, stopTimer])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { snippet, cursorIndex, errors, startTime, isComplete } = stateRef.current
    if (!snippet || isComplete) return

    const { key } = e

    if (key === 'Tab') {
      e.preventDefault()
      const keysToProcess = Math.min(4, snippet.code.length - cursorIndex)
      if (keysToProcess <= 0) return
      setState((prev) => {
        const newErrors = new Set(prev.errors)
        let newIndex = prev.cursorIndex
        const newStartTime = prev.startTime ?? Date.now()
        for (let i = 0; i < keysToProcess; i++) {
          if (snippet.code[newIndex] !== ' ') newErrors.add(newIndex)
          newIndex++
        }
        const isComplete = newIndex >= snippet.code.length
        if (isComplete) stopTimer()
        else if (!prev.startTime) startTimer(newStartTime)
        return { ...prev, cursorIndex: newIndex, errors: newErrors, startTime: newStartTime, isComplete }
      })
      return
    }

    if (key === 'Backspace') {
      setState((prev) => {
        if (prev.cursorIndex === 0) return prev
        const newErrors = new Set(prev.errors)
        newErrors.delete(prev.cursorIndex - 1)
        return { ...prev, cursorIndex: prev.cursorIndex - 1, errors: newErrors }
      })
      return
    }

    let typed: string | null = null
    if (key === 'Enter') typed = '\n'
    else if (key.length === 1) typed = key

    if (typed === null) return

    setState((prev) => {
      if (prev.cursorIndex >= snippet.code.length) return prev
      const newErrors = new Set(prev.errors)
      const newStartTime = prev.startTime ?? Date.now()
      if (typed !== snippet.code[prev.cursorIndex]) newErrors.add(prev.cursorIndex)
      const newIndex = prev.cursorIndex + 1
      const isComplete = newIndex >= snippet.code.length
      if (isComplete) stopTimer()
      else if (!prev.startTime) startTimer(newStartTime)
      return { ...prev, cursorIndex: newIndex, errors: newErrors, startTime: newStartTime, isComplete }
    })
  }, [startTimer, stopTimer])

  const reset = useCallback(() => {
    stopTimer()
    setElapsedMs(0)
    setState((prev) => ({
      ...prev,
      cursorIndex: 0,
      errors: new Set(),
      startTime: null,
      isComplete: false,
    }))
  }, [stopTimer])

  const newSnippet = useCallback(() => {
    loadSnippet(language)
  }, [language, loadSnippet])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const wpm = state.cursorIndex > 0 && elapsedMs > 0
    ? Math.round((state.cursorIndex / 5) / (elapsedMs / 60000))
    : 0

  const accuracy = state.cursorIndex > 0
    ? Math.round(((state.cursorIndex - state.errors.size) / state.cursorIndex) * 100)
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
    reset,
    newSnippet,
  }
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- --watchAll=false --testPathPattern=useTypingGame
```

Expected: All 14 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTypingGame.ts src/hooks/useTypingGame.test.ts
git commit -m "feat: add useTypingGame hook with full typing engine and tests"
```

---

### Task 4: SnippetDisplay Component

**Files:**
- Create: `src/components/SnippetDisplay.tsx`

**Interfaces:**
- Consumes: `snippet: Snippet`, `cursorIndex: number`, `errors: Set<number>` from `useTypingGame`
- Produces: `<SnippetDisplay snippet={...} cursorIndex={...} errors={...} />`

- [ ] **Step 1: Create src/components/SnippetDisplay.tsx**

```tsx
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
```

- [ ] **Step 2: Verify — add to App.tsx temporarily and start the server**

Temporarily update `src/App.tsx` to smoke-test the component:

```tsx
import SnippetDisplay from './components/SnippetDisplay'
import { useTypingGame } from './hooks/useTypingGame'

export default function App() {
  const { snippet, cursorIndex, errors, handleKeyDown } = useTypingGame()

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (!snippet) return <div className="text-terminal-accent p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-terminal-bg p-8">
      <SnippetDisplay snippet={snippet} cursorIndex={cursorIndex} errors={errors} />
    </div>
  )
}
```

Run `npm start`. Verify: snippet renders, cursor blinks, typing highlights characters green or red, Enter key shows ↵ hint. Stop the server when satisfied.

- [ ] **Step 3: Revert App.tsx to the loading placeholder**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-primary flex items-center justify-center font-mono">
      <p className="text-terminal-accent animate-pulse">{'> SLEEPY_CODER.exe loading...'}</p>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SnippetDisplay.tsx src/App.tsx
git commit -m "feat: add SnippetDisplay component with character-level highlighting"
```

---

### Task 5: ResultCard Component

**Files:**
- Create: `src/components/ResultCard.tsx`

**Interfaces:**
- Consumes: `wpm: number`, `accuracy: number`, `elapsedMs: number`, `onPlayAgain: () => void`, `onNewSnippet: () => void`
- Produces: `<ResultCard wpm={...} accuracy={...} elapsedMs={...} onPlayAgain={...} onNewSnippet={...} />`

- [ ] **Step 1: Create src/components/ResultCard.tsx**

```tsx
interface Props {
  wpm: number
  accuracy: number
  elapsedMs: number
  onPlayAgain: () => void
  onNewSnippet: () => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function ResultCard({ wpm, accuracy, elapsedMs, onPlayAgain, onNewSnippet }: Props) {
  return (
    <div className="p-8 flex flex-col items-center gap-8">
      <div className="text-terminal-accent text-sm tracking-widest uppercase">
        {'>> TRANSMISSION COMPLETE <<'}
      </div>

      <div className="flex gap-12 text-center">
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {wpm}
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">wpm</div>
        </div>
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {accuracy}%
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">accuracy</div>
        </div>
        <div>
          <div className="text-6xl font-bold text-terminal-primary" style={{ textShadow: '0 0 20px #bf00ff' }}>
            {formatTime(elapsedMs)}
          </div>
          <div className="text-terminal-untyped text-xs tracking-widest mt-2 uppercase">time</div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="px-6 py-2 border border-terminal-border text-terminal-primary hover:border-terminal-accent hover:shadow-glow-sm transition-all duration-200 text-sm tracking-widest uppercase"
        >
          {'[ PLAY AGAIN ]'}
        </button>
        <button
          onClick={onNewSnippet}
          className="px-6 py-2 border border-terminal-accent text-terminal-accent hover:shadow-glow transition-all duration-200 text-sm tracking-widest uppercase"
        >
          {'[ NEW SNIPPET ]'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ResultCard.tsx
git commit -m "feat: add ResultCard component"
```

---

### Task 6: Header and LanguageSelector Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/LanguageSelector.tsx`

**Interfaces:**
- Header consumes: `wpm: number`, `accuracy: number`
- LanguageSelector consumes: `language: Language`, `onSelect: (lang: Language) => void`

- [ ] **Step 1: Create src/components/Header.tsx**

```tsx
interface Props {
  wpm: number
  accuracy: number
}

export default function Header({ wpm, accuracy }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-terminal-border">
      <div className="text-terminal-accent font-bold tracking-widest text-sm" style={{ textShadow: '0 0 8px #bf00ff' }}>
        {'> SLEEPY_CODER.exe'}
      </div>
      <div className="flex gap-6 text-xs tracking-widest text-terminal-untyped uppercase">
        <span>
          WPM: <span className="text-terminal-primary font-bold">{wpm > 0 ? wpm : '--'}</span>
        </span>
        <span>
          ACC: <span className="text-terminal-primary font-bold">{wpm > 0 ? `${accuracy}%` : '--%'}</span>
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/LanguageSelector.tsx**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx src/components/LanguageSelector.tsx
git commit -m "feat: add Header and LanguageSelector components"
```

---

### Task 7: GameBar Component

**Files:**
- Create: `src/components/GameBar.tsx`

**Interfaces:**
- Consumes: `elapsedMs: number`, `progress: number` (0–1), `onReset: () => void`

- [ ] **Step 1: Create src/components/GameBar.tsx**

```tsx
interface Props {
  elapsedMs: number
  progress: number
  onReset: () => void
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function GameBar({ elapsedMs, progress, onReset }: Props) {
  const pct = Math.round(Math.min(progress, 1) * 100)

  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-terminal-border">
      <span className="text-terminal-untyped text-xs tracking-widest uppercase w-24 shrink-0">
        TIME: <span className="text-terminal-primary font-bold">{formatTime(elapsedMs)}</span>
      </span>

      <div className="flex-1 h-1.5 bg-terminal-surface border border-terminal-border rounded-none overflow-hidden">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #7c3aed, #c084fc)',
            boxShadow: pct > 0 ? '0 0 6px #bf00ff' : 'none',
          }}
        />
      </div>

      <span className="text-terminal-untyped text-xs w-10 shrink-0 text-right">{pct}%</span>

      <button
        onClick={onReset}
        className="text-xs tracking-widest uppercase text-terminal-untyped hover:text-terminal-error border border-terminal-border hover:border-terminal-error px-2 py-1 transition-all duration-150 shrink-0"
      >
        RST
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/GameBar.tsx
git commit -m "feat: add GameBar component with timer and progress bar"
```

---

### Task 8: TypingArea Component

**Files:**
- Create: `src/components/TypingArea.tsx`

**Interfaces:**
- Consumes all display props from `useTypingGame`, plus `onReset`, `onNewSnippet`
- Renders `SnippetDisplay` when not complete, `ResultCard` when complete

- [ ] **Step 1: Create src/components/TypingArea.tsx**

```tsx
import { Snippet } from '../lib/snippets/types'
import SnippetDisplay from './SnippetDisplay'
import ResultCard from './ResultCard'

interface Props {
  snippet: Snippet | null
  cursorIndex: number
  errors: Set<number>
  wpm: number
  accuracy: number
  elapsedMs: number
  isComplete: boolean
  isLoading: boolean
  onReset: () => void
  onNewSnippet: () => void
}

export default function TypingArea({
  snippet, cursorIndex, errors, wpm, accuracy, elapsedMs,
  isComplete, isLoading, onReset, onNewSnippet,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-terminal-untyped text-xs tracking-widest animate-pulse">
        {'> LOADING SNIPPET...'}
      </div>
    )
  }

  if (!snippet) return null

  if (isComplete) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ResultCard
          wpm={wpm}
          accuracy={accuracy}
          elapsedMs={elapsedMs}
          onPlayAgain={onReset}
          onNewSnippet={onNewSnippet}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <SnippetDisplay snippet={snippet} cursorIndex={cursorIndex} errors={errors} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TypingArea.tsx
git commit -m "feat: add TypingArea component"
```

---

### Task 9: App.tsx Integration

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Wires `useTypingGame` → all components
- Attaches keyboard listener to `window`

- [ ] **Step 1: Replace src/App.tsx with the final wired version**

```tsx
import { useEffect } from 'react'
import { useTypingGame } from './hooks/useTypingGame'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import GameBar from './components/GameBar'
import TypingArea from './components/TypingArea'

export default function App() {
  const {
    snippet, cursorIndex, errors, elapsedMs,
    isComplete, isLoading, wpm, accuracy, language,
    handleKeyDown, setLanguage, reset, newSnippet,
  } = useTypingGame()

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
      <LanguageSelector language={language} onSelect={setLanguage} />
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
  )
}
```

- [ ] **Step 2: Run the app and test the full flow**

```bash
npm start
```

Verify the following manually:

1. App loads with a Python snippet and blinking cursor
2. Typing correct keys highlights them purple (primary)
3. Typing wrong keys highlights them hot pink (error)
4. Backspace un-highlights and moves cursor back
5. Tab press advances 4 characters
6. Enter press on a line ending moves to next line
7. Language tabs switch snippet and reset state
8. RST button resets the current snippet
9. Completing the snippet shows the ResultCard with WPM, accuracy, time
10. PLAY AGAIN resets the same snippet; NEW SNIPPET loads a new one

- [ ] **Step 3: Run the test suite**

```bash
npm test -- --watchAll=false
```

Expected: All tests pass. Fix any regressions before committing.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire all components in App.tsx — Sleepy Coder complete"
```
