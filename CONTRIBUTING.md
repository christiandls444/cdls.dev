# Contributing

Same rules for every developer and every AI agent. CI rejects PRs that don't follow them
(`.github/workflows/pr-conventions.yml`).

## Branches

```
<type>/<short-kebab-name>
```

| Example                    | When                       |
| -------------------------- | -------------------------- |
| `feat/project-rag-chatbot` | new feature or new content |
| `fix/logo-contrast`        | bug fix                    |
| `chore/upgrade-next`       | tooling, deps, config      |
| `docs/deployment-steps`    | docs only                  |
| `hotfix/broken-header`     | urgent fix, from `main`    |

- Lowercase, numbers and hyphens only. 2 to 4 words.
- Branch from `develop` (except `hotfix/*`, which branches from `main`).
- One branch = one change. Delete after merge (GitHub does this automatically).

## Commit messages and PR titles

[Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <what changed>
```

```
feat(projects): add RAG chatbot project
fix(a11y): raise gold contrast in light mode
chore(deps): bump next to 16.5.0
docs(readme): add deploy badge
```

- **Lowercase**, **imperative** ("add", not "added" or "adds"), **no period**, max 72 characters.
- Scope is optional but preferred.
- Breaking change: add `!`, e.g. `feat(content)!: rename project fields`.
- PRs are **squash merged**, so the **PR title becomes the commit** on `develop`. Get the title right.
  Commits inside your branch can be rough. Only the PR title is checked.

### Types

| Type       | Use for                                 | Example                                      |
| ---------- | --------------------------------------- | -------------------------------------------- |
| `feat`     | new feature, section, page or content   | `feat(projects): add agent workflows`        |
| `fix`      | bug fix                                 | `fix(layout): stop header overlap on mobile` |
| `style`    | visual/design tweak, no behavior change | `style(ui): soften card borders`             |
| `refactor` | code change, same behavior              | `refactor(ui): merge icon components`        |
| `perf`     | faster or lighter                       | `perf(seo): preload hero font`               |
| `test`     | add or change tests                     | `test(security): cover CSP on 404`           |
| `docs`     | documentation only                      | `docs(agents): add testing section`          |
| `ci`       | GitHub Actions                          | `ci: cache Playwright browsers`              |
| `build`    | build system, Next/Vercel config        | `build(config): enable image formats`        |
| `chore`    | maintenance, deps, releases             | `chore(release): v0.2.0`                     |
| `revert`   | undo a previous commit                  | `revert: feat(projects): add chatbot`        |

### Scopes

`content` · `projects` · `stack` · `ui` · `layout` · `a11y` · `security` · `seo` · `config` ·
`tests` · `docs` · `readme` · `agents` · `ci` · `deps` · `deps-dev` · `release`

Need a new scope? Add it here **and** in `.github/workflows/pr-conventions.yml` in the same PR.

## Flow

```
feat/x ──PR (squash)──▶ develop ──PR "chore(release): vX.Y.Z" (merge commit)──▶ main
hotfix/x ──PR (squash)──▶ main ──PR (merge commit)──▶ develop
```

1. `git switch develop && git pull && git switch -c feat/<name>`
2. Commit, push, open a PR into `develop` with a conventional title. Wait for CI to pass.
3. Squash merge, then check staging.
4. Release: open a PR from `develop` into `main` titled `chore(release): vX.Y.Z` and use a **merge commit**.

## Authorship

The repo owner is the only author. **Never** add AI attribution (`Co-Authored-By: …`, "Generated with …")
to commits or PRs.
