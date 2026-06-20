import { Snippet } from '../types'

export const bashSnippets: Snippet[] = [
  {
    id: 'bash-health-check',
    language: 'bash',
    title: 'System Health Check',
    code: `health_check() {
    echo "== System Health =="
    echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
    echo "Memory:"
    free -h | awk '/^Mem:/ {print "  Used: "$3" / "$2}'
    echo "Disk:"
    df -h / | awk 'NR==2 {print "  Used: "$3" / "$2" ("$5")"}'
    echo "Uptime: $(uptime -p)"
}`,
  },
  {
    id: 'bash-find-large',
    language: 'bash',
    title: 'Find Large Files',
    code: `find_large() {
    local dir=\${1:-.} count=\${2:-10}
    echo "Top $count largest files in $dir:"
    find "$dir" -type f -printf '%s %p\n' 2>/dev/null \\
        | sort -rn \\
        | head -"$count" \\
        | awk '{printf "%10.1f MB  %s\n", $1/1048576, $2}'
}`,
  },
  {
    id: 'bash-rotate-logs',
    language: 'bash',
    title: 'Rotate Logs',
    code: `rotate_logs() {
    local log_dir=$1 days=\${2:-7}
    find "$log_dir" -name "*.log" -mtime +"$days" | while read -r f; do
        gzip "$f" && echo "Compressed: $f"
    done
    find "$log_dir" -name "*.log.gz" -mtime +30 -delete
    echo "Log rotation complete"
}`,
  },
  {
    id: 'bash-retry',
    language: 'bash',
    title: 'Retry with Backoff',
    code: `retry() {
    local retries=$1 delay=1
    shift
    local count=0
    until "$@"; do
        count=$((count + 1))
        if [ "$count" -ge "$retries" ]; then
            echo "Command failed after $retries attempts"
            return 1
        fi
        echo "Attempt $count failed. Retrying in \${delay}s..."
        sleep "$delay"
        delay=$((delay * 2))
    done
}`,
  },
  {
    id: 'bash-bulk-replace',
    language: 'bash',
    title: 'Bulk Find & Replace',
    code: `bulk_replace() {
    local pattern=$1 replacement=$2 dir=\${3:-.}
    local count=0
    while IFS= read -r -d '' file; do
        if grep -q "$pattern" "$file"; then
            sed -i "s|$pattern|$replacement|g" "$file"
            echo "Updated: $file"
            count=$((count + 1))
        fi
    done < <(find "$dir" -type f -print0)
    echo "Modified $count file(s)"
}`,
  },
  {
    id: 'bash-process-check',
    language: 'bash',
    title: 'Process Monitor',
    code: `process_check() {
    local process=$1
    if pgrep -x "$process" > /dev/null; then
        local pid
        pid=$(pgrep -x "$process")
        echo "$process is running (PID: $pid)"
        ps -p "$pid" -o pid,ppid,%cpu,%mem,etime --no-headers
    else
        echo "$process is NOT running"
        return 1
    fi
}`,
  },
  {
    id: 'bash-batch-rename',
    language: 'bash',
    title: 'Batch Rename Files',
    code: `batch_rename() {
    local dir=$1 from=$2 to=$3
    local count=0
    for f in "$dir"/*"$from"*; do
        [ -e "$f" ] || continue
        local new="\${f//$from/$to}"
        mv "$f" "$new"
        echo "Renamed: $(basename "$f") → $(basename "$new")"
        count=$((count + 1))
    done
    echo "Renamed $count file(s)"
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
