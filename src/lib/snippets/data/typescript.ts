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
