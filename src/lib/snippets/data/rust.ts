import { Snippet } from '../types'

export const rustSnippets: Snippet[] = [
  {
    id: 'rust-fibonacci',
    language: 'rust',
    title: 'Fibonacci Recursive',
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
  {
    id: 'rust-two-sum',
    language: 'rust',
    title: 'Two Sum HashMap',
    code: `use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Vec<usize> {
    let mut seen: HashMap<i32, usize> = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let complement = target - num;
        if let Some(&j) = seen.get(&complement) {
            return vec![j, i];
        }
        seen.insert(num, i);
    }
    vec![]
}`,
  },
  {
    id: 'rust-two-pointers',
    language: 'rust',
    title: 'Two Pointers Palindrome',
    code: `fn is_palindrome(s: &str) -> bool {
    let chars: Vec<char> = s.chars().collect();
    let (mut left, mut right) = (0, chars.len().saturating_sub(1));
    while left < right {
        if chars[left] != chars[right] { return false; }
        left += 1;
        right -= 1;
    }
    true
}

fn pair_sum_sorted(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let (mut left, mut right) = (0, nums.len() - 1);
    while left < right {
        match (nums[left] + nums[right]).cmp(&target) {
            std::cmp::Ordering::Equal => return Some((left, right)),
            std::cmp::Ordering::Less => left += 1,
            std::cmp::Ordering::Greater => right -= 1,
        }
    }
    None
}`,
  },
  {
    id: 'rust-sliding-window',
    language: 'rust',
    title: 'Sliding Window No Repeat',
    code: `use std::collections::HashMap;

fn length_of_longest_substring(s: &str) -> usize {
    let mut seen: HashMap<char, usize> = HashMap::new();
    let chars: Vec<char> = s.chars().collect();
    let (mut left, mut max_len) = (0, 0);
    for (right, &c) in chars.iter().enumerate() {
        if let Some(&idx) = seen.get(&c) {
            if idx >= left { left = idx + 1; }
        }
        seen.insert(c, right);
        max_len = max_len.max(right - left + 1);
    }
    max_len
}`,
  },
  {
    id: 'rust-linked-list-ops',
    language: 'rust',
    title: 'Linked List Reverse and Cycle',
    code: `fn reverse_list(list: Vec<i32>) -> Vec<i32> {
    let mut result = list;
    result.reverse();
    result
}

// Floyd's cycle detection via index-based linked list
// next[i] = Some(j) means node i points to node j
fn has_cycle(next: &[Option<usize>]) -> bool {
    if next.is_empty() { return false; }
    let (mut slow, mut fast) = (0, 0);
    loop {
        slow = match next[slow] { Some(n) => n, None => return false };
        fast = match next[fast] { Some(n) => n, None => return false };
        fast = match next[fast] { Some(n) => n, None => return false };
        if slow == fast { return true; }
    }
}`,
  },
  {
    id: 'rust-tree-bfs',
    language: 'rust',
    title: 'Binary Tree BFS',
    code: `use std::collections::VecDeque;

type Link = Option<Box<TreeNodeBFS>>;
struct TreeNodeBFS { val: i32, left: Link, right: Link }

fn level_order(root: &Link) -> Vec<Vec<i32>> {
    let mut result = vec![];
    let mut queue = VecDeque::new();
    if let Some(node) = root { queue.push_back(node.as_ref()); }
    while !queue.is_empty() {
        let sz = queue.len();
        let mut level = vec![];
        for _ in 0..sz {
            let node = queue.pop_front().unwrap();
            level.push(node.val);
            if let Some(l) = &node.left { queue.push_back(l); }
            if let Some(r) = &node.right { queue.push_back(r); }
        }
        result.push(level);
    }
    result
}`,
  },
  {
    id: 'rust-number-of-islands',
    language: 'rust',
    title: 'DFS Number of Islands',
    code: `fn dfs(grid: &mut Vec<Vec<char>>, r: usize, c: usize) {
    if grid[r][c] != '1' { return; }
    grid[r][c] = '0';
    if r + 1 < grid.len()     { dfs(grid, r+1, c); }
    if r > 0                  { dfs(grid, r-1, c); }
    if c + 1 < grid[0].len()  { dfs(grid, r, c+1); }
    if c > 0                  { dfs(grid, r, c-1); }
}

fn num_islands(mut grid: Vec<Vec<char>>) -> usize {
    let (rows, cols) = (grid.len(), grid[0].len());
    let mut count = 0;
    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == '1' { dfs(&mut grid, r, c); count += 1; }
        }
    }
    count
}`,
  },
  {
    id: 'rust-knapsack',
    language: 'rust',
    title: 'Knapsack DP',
    code: `fn knapsack(weights: &[usize], values: &[usize], capacity: usize) -> usize {
    let n = weights.len();
    let mut dp = vec![vec![0usize; capacity + 1]; n + 1];
    for i in 1..=n {
        for w in 0..=capacity {
            dp[i][w] = dp[i-1][w];
            if weights[i-1] <= w {
                let include = dp[i-1][w - weights[i-1]] + values[i-1];
                if include > dp[i][w] { dp[i][w] = include; }
            }
        }
    }
    dp[n][capacity]
}`,
  },
]
