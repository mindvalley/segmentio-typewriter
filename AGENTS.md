# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the TypeScript source, including CLI commands (`src/commands`), language generators (`src/languages`), hooks (`src/hooks`), and telemetry (`src/telemetry`).
- `src/__tests__` holds unit and typedef tests.
- `test/env` contains integration test fixtures; generated outputs are written to `test-env/` (gitignored).
- `bin/` provides OCLIF entry points such as `bin/run` and `bin/dev`.
- `dist/` is the compiled output from `pnpm build`.
- `typewriter.yml` is the local configuration file used by the CLI.

## Build, Test, and Development Commands
- `nvm use` selects Node.js 18 from `.nvmrc`.
- `pnpm install` installs dependencies.
- `pnpm build` compiles to `dist/`, copies templates, and builds telemetry artifacts.
- `./bin/dev build -m prod -u` runs the CLI in dev mode without needing a global install.
- `pnpm lint` runs ESLint; `pnpm lint:fix` applies auto-fixes.
- `pnpm test` runs typedef tests plus Jest; `pnpm test --updateSnapshot` updates snapshots.
- `pnpm test:typedef` runs only the TypeScript typedef tests.

## Coding Style & Naming Conventions
- TypeScript with `strict` enabled; follow the existing patterns in nearby files.
- ESLint uses `standard-with-typescript`. Prefer 2-space indentation and the StandardJS style enforced by `pnpm lint`.
- Use `camelCase` for variables/functions and `PascalCase` for types/classes.
- File names are lowercase; use hyphens when needed (example: `base-command.ts`).

## Testing Guidelines
- Jest + ts-jest are used for tests. Test files follow `*.test.ts` (see `jest.config.js`).
- Keep snapshots current when outputs change: `pnpm test --updateSnapshot`.
- Integration fixtures live in `test/env`; verify generated outputs in `test-env/` when adjusting code generation.

## Commit & Pull Request Guidelines
- Recent history favors short, imperative subjects. Common prefixes include `feat:`, `fix:`, and `chore:`; PR numbers are sometimes appended in parentheses.
- Fill out the PR template in `.github/PULL_REQUEST_TEMPLATE.md`, describe intent and impact, and link relevant issues.
- Include test evidence or reproduction notes when behavior changes.

## Security & Configuration Tips
- Keep API tokens and customer identifiers out of source control. Use local `typewriter.yml` values or environment variables when testing.
