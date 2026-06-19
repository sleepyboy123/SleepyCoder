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
