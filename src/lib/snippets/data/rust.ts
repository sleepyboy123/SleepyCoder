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
