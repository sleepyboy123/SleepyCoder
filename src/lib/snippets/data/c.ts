import { Snippet } from '../types'

export const cSnippets: Snippet[] = [
  {
    id: 'c-fibonacci',
    language: 'c',
    title: 'Fibonacci Recursive',
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
    title: 'GCD Euclidean',
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
  {
    id: 'c-two-pointers',
    language: 'c',
    title: 'Two Pointers Palindrome',
    code: `int is_palindrome(char* s, int len) {
    int left = 0, right = len - 1;
    while (left < right) {
        if (s[left] != s[right]) return 0;
        left++; right--;
    }
    return 1;
}

int* pair_sum_sorted(int* nums, int n, int target, int* out) {
    int left = 0, right = n - 1;
    while (left < right) {
        int s = nums[left] + nums[right];
        if (s == target) { out[0] = left; out[1] = right; return out; }
        else if (s < target) left++;
        else right--;
    }
    return NULL;
}`,
  },
  {
    id: 'c-sliding-window',
    language: 'c',
    title: 'Sliding Window No Repeat',
    code: `int length_of_longest_substring(char* s) {
    int seen[128];
    memset(seen, -1, sizeof(seen));
    int left = 0, max_len = 0;
    for (int right = 0; s[right]; right++) {
        int c = (unsigned char)s[right];
        if (seen[c] >= left) {
            left = seen[c] + 1;
        }
        seen[c] = right;
        if (right - left + 1 > max_len)
            max_len = right - left + 1;
    }
    return max_len;
}`,
  },
  {
    id: 'c-linked-list-ops',
    language: 'c',
    title: 'Linked List Reverse and Cycle',
    code: `struct ListNode { int val; struct ListNode* next; };

struct ListNode* reverse_list(struct ListNode* head) {
    struct ListNode* prev = NULL;
    struct ListNode* curr = head;
    while (curr) {
        struct ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr; curr = nxt;
    }
    return prev;
}

int has_cycle(struct ListNode* head) {
    struct ListNode* slow = head;
    struct ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return 1;
    }
    return 0;
}`,
  },
  {
    id: 'c-tree-bfs',
    language: 'c',
    title: 'Binary Tree BFS',
    code: `struct TreeNode { int val; struct TreeNode *left, *right; };

int max_depth(struct TreeNode* root) {
    if (!root) return 0;
    int l = max_depth(root->left);
    int r = max_depth(root->right);
    return 1 + (l > r ? l : r);
}

void level_order(struct TreeNode* root) {
    if (!root) return;
    struct TreeNode* queue[1024];
    int front = 0, back = 0;
    queue[back++] = root;
    while (front < back) {
        struct TreeNode* node = queue[front++];
        printf("%d ", node->val);
        if (node->left)  queue[back++] = node->left;
        if (node->right) queue[back++] = node->right;
    }
}`,
  },
  {
    id: 'c-number-of-islands',
    language: 'c',
    title: 'DFS Number of Islands',
    code: `void dfs(char** grid, int rows, int cols, int r, int c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, rows, cols, r+1, c);
    dfs(grid, rows, cols, r-1, c);
    dfs(grid, rows, cols, r, c+1);
    dfs(grid, rows, cols, r, c-1);
}

int num_islands(char** grid, int rows, int cols) {
    int count = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == '1') {
                dfs(grid, rows, cols, r, c);
                count++;
            }
    return count;
}`,
  },
  {
    id: 'c-knapsack',
    language: 'c',
    title: 'Knapsack DP',
    code: `int knapsack(int* weights, int* values, int n, int capacity) {
    int dp[n+1][capacity+1];
    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = (i == 0) ? 0 : dp[i-1][w];
            if (i > 0 && weights[i-1] <= w) {
                int include = dp[i-1][w-weights[i-1]] + values[i-1];
                if (include > dp[i][w]) dp[i][w] = include;
            }
        }
    }
    return dp[n][capacity];
}`,
  },
]
