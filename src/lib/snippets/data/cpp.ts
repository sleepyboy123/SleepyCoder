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
