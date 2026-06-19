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
    local left=0 right=$((\${#arr[@]} - 1))
    while [ $left -le $right ]; do
        local mid=$(( (left + right) / 2 ))
        if [ "\${arr[$mid]}" -eq "$target" ]; then
            echo $mid; return
        elif [ "\${arr[$mid]}" -lt "$target" ]; then
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
    local n=\${#arr[@]}
    for ((i = 0; i < n - 1; i++)); do
        for ((j = 0; j < n - i - 1; j++)); do
            if [ "\${arr[$j]}" -gt "\${arr[$((j + 1))]}" ]; then
                local temp=\${arr[$j]}
                arr[$j]=\${arr[$((j + 1))]}
                arr[$((j + 1))]=$temp
            fi
        done
    done
    echo "\${arr[@]}"
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
    cp -r "$source" "$dest/backup_\${timestamp}"
    echo "Backup created: $dest/backup_\${timestamp}"
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
