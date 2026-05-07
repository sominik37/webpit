#!/bin/bash

# WebPit Finder Quick Action Script
# This script can be used in Automator to create a "Quick Action" in Finder.
# 1. Open Automator.app
# 2. Choose "Quick Action"
# 3. Workflow receives current "files or folders" in "Finder"
# 4. Add "Run Shell Script" action
# 5. Pass input "as arguments"
# 6. Paste the following:

WEBPIT_PATH="/Applications/WebPit.app/Contents/MacOS/WebPit"

if [ ! -f "$WEBPIT_PATH" ]; then
    # Try common local dev path if not installed
    WEBPIT_PATH="./src-tauri/target/release/WebPit"
fi

for f in "$@"
do
    # URL encode the path for the deep link
    encoded_path=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$f'''))")
    open "webpit://convert?path=$encoded_path"
done
