import os
import re

# --- Configuration ---
ROOT_DIR = "."   # change this if your HTML files are in another folder
SCRIPT_TAG = '<script src="404.js"></script>'

def inject_script(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if SCRIPT_TAG in content:
        print(f"Already injected: {file_path}")
        return

    # Find the <head> tag and insert after it
    new_content, count = re.subn(
        r"(<head[^>]*>)",
        rf"\1\n    {SCRIPT_TAG}",
        content,
        count=1,
        flags=re.IGNORECASE
    )

    if count == 0:
        print(f"⚠️ No <head> found in {file_path}, skipping.")
        return

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ Injected 404.js into {file_path}")

def main():
    for root, _, files in os.walk(ROOT_DIR):
        for file in files:
            if file.lower().endswith(".html"):
                inject_script(os.path.join(root, file))

if __name__ == "__main__":
    main()
