#!/bin/bash

# Launch ERD Explorer with auto-loading file feature
# Usage: ./launch-with-file.sh [file_path] [mode]
# Mode: dev (default) or prod

FILE_PATH="$1"
MODE="${2:-dev}"

if [ -z "$FILE_PATH" ]; then
    echo "Usage: $0 <file_path> [dev|prod]"
    echo "Example: $0 app/data/test-erd.mmd dev"
    exit 1
fi

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "Error: File '$FILE_PATH' not found"
    exit 1
fi

# Check file extension
case "$FILE_PATH" in
    *.mmd|*.md|*.txt)
        echo "✓ File type supported: $FILE_PATH"
        ;;
    *)
        echo "⚠ Warning: File type may not be supported. Use .mmd, .md, or .txt files."
        ;;
esac

# Use relative path for better browser compatibility
REL_PATH="$FILE_PATH"

# Start server based on mode
if [ "$MODE" = "prod" ]; then
    echo "Starting production server..."
    npm run build
    npm run start &
    SERVER_PID=$!
    PORT=3000
else
    echo "Starting development server..."
    npm run dev &
    SERVER_PID=$!
    PORT=5173
fi

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Try to detect the actual port (in case 5173 is taken)
if [ "$MODE" = "dev" ]; then
    # Check if server is running and try to find actual port
    for port in 5173 5174 5175 5176 5177 5178 5179 5180; do
        if curl -s "http://localhost:$port" > /dev/null 2>&1; then
            PORT=$port
            break
        fi
    done
fi

# Construct URL with file parameter using relative path
URL="http://localhost:$PORT/?file=$REL_PATH"

echo "Server running on port $PORT"
echo "Opening: $URL"
echo ""
echo "Note: For best results, use relative paths within the project (e.g., app/data/your-file.mmd)"

# Open browser (works on macOS, Linux, and Windows)
if command -v open > /dev/null 2>&1; then
    open "$URL"
elif command -v xdg-open > /dev/null 2>&1; then
    xdg-open "$URL"
elif command -v start > /dev/null 2>&1; then
    start "$URL"
else
    echo "Please open the following URL manually:"
    echo "$URL"
fi

echo "Press Ctrl+C to stop the server"
wait $SERVER_PID