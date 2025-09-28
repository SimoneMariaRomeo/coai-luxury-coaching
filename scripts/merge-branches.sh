#!/usr/bin/env bash
set -euo pipefail

# usage: ./scripts/merge-branches.sh [source-branch]
# Merges the source branch into every other local branch and deletes
# those branches once the merge succeeds.

SOURCE_BRANCH="${1:-work}"

if ! git rev-parse --verify "$SOURCE_BRANCH" >/dev/null 2>&1; then
  echo "Source branch '$SOURCE_BRANCH' does not exist" >&2
  exit 1
fi

INITIAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$INITIAL_BRANCH" != "$SOURCE_BRANCH" ]; then
  echo "Switching to source branch '$SOURCE_BRANCH'..."
  git checkout "$SOURCE_BRANCH"
fi

echo "Checking for pending worktree changes..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Uncommitted changes detected. Please commit or stash them before running this script." >&2
  exit 1
fi

echo "Gathering target branches..."
mapfile -t TARGET_BRANCHES < <(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v "^$SOURCE_BRANCH$")

if [ ${#TARGET_BRANCHES[@]} -eq 0 ]; then
  echo "No other local branches to merge." >&2
  exit 0
fi

echo "Merging '$SOURCE_BRANCH' into: ${TARGET_BRANCHES[*]}"

for BRANCH in "${TARGET_BRANCHES[@]}"; do
  echo "---"
  echo "Processing branch '$BRANCH'"
  git checkout "$BRANCH"
  if git merge --ff-only "$SOURCE_BRANCH"; then
    echo "Fast-forwarded '$BRANCH' to '$SOURCE_BRANCH'"
  else
    echo "Fast-forward failed, performing a regular merge with --no-edit"
    git merge --no-edit "$SOURCE_BRANCH"
  fi
  BRANCH_COMMIT=$(git rev-parse "$BRANCH")
  SOURCE_COMMIT=$(git rev-parse "$SOURCE_BRANCH")
  if [ "$BRANCH_COMMIT" = "$SOURCE_COMMIT" ]; then
    git checkout "$SOURCE_BRANCH"
    git branch -d "$BRANCH"
    echo "Deleted merged branch '$BRANCH'"
  else
    echo "Branch '$BRANCH' now includes '$SOURCE_BRANCH' but still diverges; leaving branch in place" >&2
    git checkout "$SOURCE_BRANCH"
  fi

done

if [ "$INITIAL_BRANCH" != "$SOURCE_BRANCH" ]; then
  git checkout "$INITIAL_BRANCH"
fi

echo "Branch merge process complete."
