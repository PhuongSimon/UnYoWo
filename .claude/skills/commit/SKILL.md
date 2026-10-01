---
name: commit
description: Commit (and optionally push) UnYoWo changes following the project's commit rules, splitting work into several clear commits, then output a PR title and description after pushing. Use when the user asks to commit, commit và push, push code, or runs /commit.
---

# Commit – commit (và push) theo quy tắc của UnYoWo

## 0. Guard: must be on a task branch

Run `git branch --show-current` first.
- If it is `main`, `master`, `develop`, or empty (detached HEAD) → **STOP. Do not stage or commit anything.**
  Tell the user (Vietnamese): they are on `<branch>`, commits must go on a task branch, and they should run `/branch <mô tả task>` first. Then end the turn.
- If the branch name does not follow `feat/…`, `enhance/…`, `fix/…`, warn in one line but continue.

## 1. Push or not?

- Push **only** if the user's request explicitly asks for it: "commit và push", "commit and push", "push", "/commit push", "đẩy lên".
- Plain "commit" / "/commit" → commit only, **never push**.

## 2. Inspect and check

1. `git status --short` and `git diff` / `git diff --stat` (plus untracked files) to understand every change.
2. Never commit: `.env`, `.env.local`, `.env.*` (except `.env.example`), `.claude/settings.local.json`, `node_modules/`, `dist/`, `*.tsbuildinfo`, secrets/keys. If one of them shows up as changed/untracked, leave it unstaged and mention it (suggest adding to `.gitignore` if missing).
3. Quality gate for each app touched:
   - `apps/web` → `pnpm --filter web lint` and `pnpm --filter web exec tsc -b`
   - `apps/api` → `pnpm --filter api lint` and `pnpm --filter api build`
   If a check fails: show the errors and ask whether to fix first or commit anyway. Do not silently commit failing code.

## 3. Commit message rules

```
<type>(<scope>): <summary>

<optional body>
```

**type** – exactly one of three:

| type | Nghĩa | Use for |
|---|---|---|
| `feat` | Làm mới chức năng | New feature, page, component, endpoint, module, DB table |
| `enhance` | Phát triển / cải thiện | Improving existing code: UI/style polish, refactor, performance, i18n strings, config, tooling, deps, docs, tests |
| `fix` | Sửa lỗi | A bug fix |

**scope** – where the change lives:
`web` (apps/web) · `api` (apps/api) · `db` (Prisma schema/migrations) · `shared` (packages/*) · `infra` (docker, CI, infrastructure/) · `repo` (root config, skills, workspace)
If a single commit truly spans web + api for one small change, use the feature name as scope (e.g. `feat(auth): …`), but prefer splitting.

**summary**
- English, imperative mood ("add", not "added"), lowercase start, no trailing period, ≤ 72 chars total header.
- Say what the user/dev gets, not which files changed.

**body** (optional, recommended when > ~5 files or non-obvious): wrap at 72 chars, bullets with `-`, explain *what & why*.

**footer** – always end every commit message with the attribution line required by the current session's system reminder (currently `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`), separated by a blank line.

Examples:
```
feat(web): add OTP verification page with auto-submit and resend timer
enhance(web): switch auth UI to primary/secondary palette and dark mode
fix(web): keep OTP digits in place when deleting a middle box
feat(api): add auth module with JWT access and refresh tokens
feat(db): add users and otp_codes tables
enhance(repo): add branch and commit skills
```

## 4. Split into several clear commits

A task usually touches many files — group them into **logical commits** (each one should make sense on its own and ideally build):
1. Group by concern, e.g. tooling/config & deps → shared UI components → feature pages → i18n strings → backend module → DB migration.
2. Keep lockfile changes in the same commit as the `package.json` change that caused them.
3. Keep web and api in separate commits unless the change is tiny and inseparable.
4. Before committing, show the plan as a short table: `# | type(scope): summary | files`. Proceed without waiting unless something is ambiguous (e.g. unrelated changes mixed in — then ask).
5. Stage with explicit paths (`git add <paths>`), never `git add -A`/`git add .` blindly. For a file with mixed concerns, it is fine to keep it in the most relevant commit rather than splitting hunks.
6. Commit with a HEREDOC so formatting is preserved:
   ```bash
   git commit -F - <<'EOF'
   feat(web): add login and register pages

   - react-hook-form + zod validation
   - Turnstile captcha on both forms

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   EOF
   ```
7. After all commits: `git log --oneline main..HEAD` and `git status --short` to confirm nothing intended was left behind.

## 5. Push (only if requested)

- First push of the branch: `git push -u origin <branch>`; afterwards `git push`.
- Never force-push unless the user explicitly asks. Never push to `main`.
- If push fails (no remote, auth, rejected), report the exact error and stop.

## 6. After a successful push: PR title + description

The user creates the PR themselves. Output (in a copy-friendly code block):

**Title** – `<type>(<scope>): <summary>` describing the whole branch (base: `main`), ≤ 72 chars.

**Description** (Markdown, English):
```markdown
## Summary
<2–4 sentences: what this branch delivers and why>

## Changes
### Frontend (apps/web)
- ...
### Backend (apps/api)
- ...
(omit sections with no changes; add Database / Infra if relevant)

## How to test
1. ...
2. ...

## Screenshots
<!-- add before/after for UI changes -->

## Notes
- follow-ups, known limitations, TODOs (e.g. temporary fake APIs)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```
Base the content on `git log main..HEAD` and `git diff --stat main...HEAD`, not on memory. The final line must be the PR attribution line from the current session's system reminder.

## 7. Report (Vietnamese)

List the commits created (hash + header), whether it was pushed, anything left uncommitted and why, and — if pushed — the PR title/description block.
