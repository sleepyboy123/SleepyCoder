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
    title: 'Fibonacci Memoized',
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
  {
    id: 'go-two-sum',
    language: 'go',
    title: 'Two Sum HashMap',
    code: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return nil
}`,
  },
  {
    id: 'go-two-pointers',
    language: 'go',
    title: 'Two Pointers Palindrome',
    code: `func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}

func pairSumSorted(nums []int, target int) []int {
    left, right := 0, len(nums)-1
    for left < right {
        s := nums[left] + nums[right]
        if s == target { return []int{left, right} }
        if s < target { left++ } else { right-- }
    }
    return nil
}`,
  },
  {
    id: 'go-sliding-window',
    language: 'go',
    title: 'Sliding Window No Repeat',
    code: `func lengthOfLongestSubstring(s string) int {
    seen := make(map[rune]int)
    left, maxLen := 0, 0
    for right, c := range s {
        if idx, ok := seen[c]; ok && idx >= left {
            left = idx + 1
        }
        seen[c] = right
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`,
  },
  {
    id: 'go-linked-list-ops',
    language: 'go',
    title: 'Linked List Reverse and Cycle',
    code: `type ListNode struct { Val int; Next *ListNode }

func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        nxt := curr.Next
        curr.Next = prev
        prev = curr
        curr = nxt
    }
    return prev
}

func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast { return true }
    }
    return false
}`,
  },
  {
    id: 'go-tree-bfs',
    language: 'go',
    title: 'Binary Tree BFS',
    code: `type TreeNodeBFS struct { Val int; Left, Right *TreeNodeBFS }

func levelOrder(root *TreeNodeBFS) [][]int {
    if root == nil { return nil }
    var result [][]int
    queue := []*TreeNodeBFS{root}
    for len(queue) > 0 {
        sz := len(queue)
        level := make([]int, 0, sz)
        for i := 0; i < sz; i++ {
            node := queue[i]
            level = append(level, node.Val)
            if node.Left != nil { queue = append(queue, node.Left) }
            if node.Right != nil { queue = append(queue, node.Right) }
        }
        queue = queue[sz:]
        result = append(result, level)
    }
    return result
}`,
  },
  {
    id: 'go-number-of-islands',
    language: 'go',
    title: 'DFS Number of Islands',
    code: `func dfsIsland(grid [][]byte, r, c int) {
    if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) || grid[r][c] != '1' {
        return
    }
    grid[r][c] = '0'
    dfsIsland(grid, r+1, c); dfsIsland(grid, r-1, c)
    dfsIsland(grid, r, c+1); dfsIsland(grid, r, c-1)
}

func numIslands(grid [][]byte) int {
    count := 0
    for r := range grid {
        for c := range grid[r] {
            if grid[r][c] == '1' {
                dfsIsland(grid, r, c)
                count++
            }
        }
    }
    return count
}`,
  },
  {
    id: 'go-knapsack',
    language: 'go',
    title: 'Knapsack DP',
    code: `func knapsack(weights, values []int, capacity int) int {
    n := len(weights)
    dp := make([][]int, n+1)
    for i := range dp {
        dp[i] = make([]int, capacity+1)
    }
    for i := 1; i <= n; i++ {
        for w := 0; w <= capacity; w++ {
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w {
                if v := dp[i-1][w-weights[i-1]] + values[i-1]; v > dp[i][w] {
                    dp[i][w] = v
                }
            }
        }
    }
    return dp[n][capacity]
}`,
  },
]
