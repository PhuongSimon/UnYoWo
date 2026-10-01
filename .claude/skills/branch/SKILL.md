---
name: branch
description: Create and check out a new git branch for a UnYoWo task following the project's branch naming rules. Use when the user asks to start a new feature/task/fix, create or checkout a branch, or runs /branch with a description of the work.
---

# Branch – tạo branch mới cho một task

The user describes the task (often in Vietnamese). Turn it into a branch name, create it, and check it out.
One branch covers the WHOLE task — frontend (`apps/web`), backend (`apps/api`) and shared packages together. Never split a task into separate FE/BE branches.

## Naming rule

```
<type>/<short-kebab-description>
```

| type | When | Matches commit prefix |
|---|---|---|
| `feat/` | A brand-new feature / page / module / endpoint | `feat` |
| `enhance/` | Improving or extending something that already exists (UI polish, refactor, performance, more fields, config, tooling) | `enhance` |
| `fix/` | Fixing a bug | `fix` |

Description rules:
- English, lowercase, kebab-case, 2–5 words, no ticket numbers unless the user gives one (then prefix it: `feat/UYW-12-vocabulary-flashcards`).
- Describe the outcome, not the layer: `feat/auth-login-register` ✅, `feat/auth-frontend` ❌.
- ASCII only (no Vietnamese diacritics), no spaces, no trailing slash.

Examples:
- "làm chức năng đăng nhập đăng ký cả FE và BE" → `feat/auth-login-register`
- "chỉnh lại màu và dark mode cho trang auth" → `enhance/auth-theme-dark-mode`
- "sửa lỗi OTP backspace bị dồn số" → `fix/otp-backspace-shift`

If the description is ambiguous between two types, pick the best one and say why in one line — do not ask unless truly unclear.

## Steps

1. Run `git status --short` and `git branch --show-current`.
2. Decide the base:
   - Default base is `main`.
   - **Working tree clean** → `git switch main`, then `git pull --ff-only` (skip the pull if there is no `origin` remote or it fails; report it).
   - **Working tree has uncommitted changes and current branch is `main`** → do NOT switch or pull (it could conflict). Create the branch from the current `main` so the changes move with it. Tell the user the changes were carried over.
   - **Uncommitted changes on another feature branch** → stop and ask whether to commit them first (suggest `/commit`) or carry them to the new branch.
3. Check the name is free: `git branch --list <name>` and `git ls-remote --heads origin <name>`. If taken, append a short suffix (`-v2`) or ask.
4. Create and switch: `git switch -c <name>`.
5. Report in Vietnamese: branch name, type chosen and why (1 line), base, whether uncommitted changes were carried over, and the next step (`/commit` when a chunk of work is done).

Never push when creating a branch. The first push happens in `/commit` with `-u`.
