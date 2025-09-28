# Branch Maintenance Guide

To keep deployments simple, use the provided helper script to merge the active `work` branch into every other local branch and prune the duplicates afterwards.

```bash
./scripts/merge-branches.sh work
```

The script performs the following steps:

1. Checks out the `work` branch (or any branch you pass as the first argument).
2. Verifies the working tree is clean so the merges do not fail.
3. Iterates through every other local branch, fast-forwarding them to the source branch when possible and falling back to a regular merge if needed.
4. Deletes any branch that ends up on the exact same commit as the source, ensuring only the up-to-date branch remains.

Run this after pulling the latest `work` updates to make sure all other local branches mirror it, and then push the deletions to the remote with:

```bash
git push origin --delete <old-branch-name>
```

If you only need a consolidated branch remotely, push the merged `work` branch to `main` and set it as the default branch in your hosting provider or GitHub repository settings.
