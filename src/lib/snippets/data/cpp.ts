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
    title: 'Fibonacci Memoized',
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
  {
    id: 'cpp-two-sum',
    language: 'cpp',
    title: 'Two Sum HashMap',
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
  },
  {
    id: 'cpp-two-pointers',
    language: 'cpp',
    title: 'Two Pointers Palindrome',
    code: `bool isPalindrome(const string& s) {
    int left = 0, right = (int)s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++; right--;
    }
    return true;
}

vector<int> pairSumSorted(vector<int>& nums, int target) {
    int left = 0, right = (int)nums.size() - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target) return {left, right};
        else if (s < target) left++;
        else right--;
    }
    return {};
}`,
  },
  {
    id: 'cpp-sliding-window',
    language: 'cpp',
    title: 'Sliding Window No Repeat',
    code: `int lengthOfLongestSubstring(const string& s) {
    unordered_map<char, int> seen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        char c = s[right];
        if (seen.count(c) && seen[c] >= left) {
            left = seen[c] + 1;
        }
        seen[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },
  {
    id: 'cpp-linked-list-ops',
    language: 'cpp',
    title: 'Linked List Reverse and Cycle',
    code: `struct ListNode { int val; ListNode* next; ListNode(int v): val(v), next(nullptr) {} };

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr, *curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr; curr = nxt;
    }
    return prev;
}

bool hasCycle(ListNode* head) {
    ListNode* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
  },
  {
    id: 'cpp-tree-bfs',
    language: 'cpp',
    title: 'Binary Tree BFS',
    code: `struct TreeNode { int val; TreeNode *left, *right; TreeNode(int v): val(v), left(nullptr), right(nullptr) {} };

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        vector<int> level;
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}`,
  },
  {
    id: 'cpp-number-of-islands',
    language: 'cpp',
    title: 'DFS Number of Islands',
    code: `void dfs(vector<vector<char>>& grid, int r, int c) {
    int rows = grid.size(), cols = grid[0].size();
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r+1, c); dfs(grid, r-1, c);
    dfs(grid, r, c+1); dfs(grid, r, c-1);
}

int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int r = 0; r < (int)grid.size(); r++)
        for (int c = 0; c < (int)grid[0].size(); c++)
            if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
    return count;
}`,
  },
  {
    id: 'cpp-knapsack',
    language: 'cpp',
    title: 'Knapsack DP',
    code: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(capacity+1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w];
            if (weights[i-1] <= w) {
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1]);
            }
        }
    }
    return dp[n][capacity];
}`,
  },
]
