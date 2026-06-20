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
]
