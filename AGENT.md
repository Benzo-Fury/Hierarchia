# AGENT Instructions

This repository follows a few guidelines for contributions and the operation of the AI agents editing it.

## Conventional Commits

- **All commits must follow the [Conventional Commits](https://www.conventionalcommits.org) specification.**
- Use the `type(scope): summary` format (e.g. `feat(relations): add cousin calculation`).
- Typical types are `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.
- Keep messages concise and describe why the change was made.

## Testing Policy

- **Write tests only for critical parts of the program that can break easily or change frequently.**
- Code that depends on external systems (databases, APIs) or implements complex logic should have tests.
- Simple deterministic helpers generally do not need tests.
- Run tests with `bun test`. Pre‑flight tests can be executed with `bun run PF-tests`.

## Style

- The repository uses Prettier for formatting. Run Prettier before committing if code style changes are made.

## Scope

These instructions apply to the entire repository.
