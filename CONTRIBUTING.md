# Contributing to DailyNotes

Thanks for taking the time to contribute. This document walks you through everything you need — from forking the repo to opening a pull request.

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Minimum version | Check with |
|---|---|---|
| Git | 2.x | `git --version` |
| Node.js | 18 | `node --version` |
| npm | 9 | `npm --version` |
| MongoDB | 6 | running locally or use MongoDB Atlas |

---

## Forking and cloning

1. **Fork** the repository on GitHub using the **Fork** button at the top right of [https://github.com/alikhere/DailyNotes](https://github.com/alikhere/DailyNotes).

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/DailyNotes.git
   cd DailyNotes
   ```

3. **Add the upstream remote** so you can pull future changes from the original repo:

   ```bash
   git remote add upstream https://github.com/alikhere/DailyNotes.git
   ```

4. **Verify your remotes:**

   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/DailyNotes.git (fetch)
   # origin    https://github.com/YOUR_USERNAME/DailyNotes.git (push)
   # upstream  https://github.com/alikhere/DailyNotes.git (fetch)
   # upstream  https://github.com/alikhere/DailyNotes.git (push)
   ```

---

## Keeping your fork up to date

Before starting any new piece of work, sync with upstream:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Branch naming

Branch names follow a `<type>/<short-description>` pattern using lowercase and hyphens.

| Type | When to use |
|---|---|
| `feat/` | A new user-facing feature |
| `fix/` | A bug fix |
| `chore/` | Dependency updates, config changes, tooling |
| `test/` | Adding or improving tests |
| `docs/` | Documentation only — no code changes |

**Examples:**

```
feat/tag-filtering
fix/note-delete-modal
chore/upgrade-axios
docs/env-setup
```

Always branch off `main`:

```bash
git checkout main
git checkout -b feat/your-feature-name
```

---

## Local setup

### 1. Server (Express + MongoDB)

```bash
cd server
cp .env.example .env     # fill in your MongoDB URI and JWT secret
npm install
npm run dev
```

The server starts at **http://localhost:8000**.

### 2. Client (React + Vite)

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The dev server starts at **http://localhost:5173** with hot module replacement.

> Make sure the server is running before you open the client — the frontend proxies API requests to the backend.

---

## Checks to run before pushing

Run these locally before opening a PR. CI will reject PRs where these fail.

### Frontend — lint

```bash
cd client
npm run lint
```

Fix all reported issues before pushing.

### Frontend — production build

```bash
cd client
npm run build
```

If the build fails (missing import, type error, etc.) fix it before pushing. Build output goes to `client/dist/` which is git-ignored.

---

## Commit message format

We use a lightweight version of Conventional Commits. Every commit message should be a single line:

```
<type>(<scope>): <short imperative description>
```

- **type** — same values as branch types: `feat`, `fix`, `chore`, `test`, `docs`
- **scope** — the part of the codebase affected (optional but encouraged)
- **description** — written in imperative mood ("add", "fix", "remove" — not "added", "fixed")

**Good examples:**

```
feat(editor): add markdown preview tab with toggle
fix(auth): clear cookie on logout response
chore(deps): upgrade react-router-dom to v6.22
docs(readme): add docker setup instructions
```

**What to avoid:**

```
# Too vague
fix stuff
update code
wip

# Wrong tense
added dark mode
fixed the login bug
```

If a commit touches multiple unrelated areas, split it into separate commits.

---

## Opening a pull request

1. Push your branch to your fork:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Go to [https://github.com/alikhere/DailyNotes](https://github.com/alikhere/DailyNotes) — GitHub will show a **Compare & pull request** banner for your recently pushed branch. Click it.

3. Set the base branch to `main`.

4. Fill in the PR description. A good description answers three questions:
   - **What** does this change?
   - **Why** is this change needed?
   - **How** can a reviewer verify it works? (steps to test, screenshots if UI)

5. Submit the pull request and wait for a review. Address any feedback with additional commits on the same branch — do not force-push a branch that already has an open PR.

---

## Code style

- **JavaScript / Node** — CommonJS modules on the server, no unused variables
- **React / JSX** — functional components only, no class components
- **CSS** — Tailwind utility classes; avoid custom CSS unless strictly necessary
- **Formatting** — keep your style consistent with the surrounding code

---

## Questions

If something is unclear, open an issue before writing code. It is much easier to align on an approach in a short discussion than to refactor a complete implementation during review.
