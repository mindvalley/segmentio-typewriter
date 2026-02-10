# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Does

Typewriter is a CLI that generates strongly-typed analytics clients from Segment Tracking Plans. It fetches JSON Schema-based tracking plans from the Segment Public API, then generates type-safe wrapper code for multiple languages and SDKs.

## Commands

- `nvm use` — select Node 18
- `pnpm install` — install dependencies
- `pnpm build` — compile TypeScript to `dist/`, copy Handlebars templates, build telemetry
- `pnpm test` — run typedef tests + Jest (uses `--runInBand`)
- `pnpm jest path/to/file.test.ts` — run a single test file
- `pnpm jest --testNamePattern="pattern"` — run tests matching a name
- `pnpm test --updateSnapshot` — update Jest snapshots
- `pnpm lint` / `pnpm lint:fix` — ESLint (standard-with-typescript)
- `./bin/dev build -m prod -u` — run the CLI locally without global install

## Architecture

### Code Generation Pipeline

```
typewriter.yml config → Fetch tracking plans (Segment API or local cache)
→ Sanitize JSON Schema → Generate types (Quicktype) → Generate SDK wrappers (Handlebars)
→ Write output files → Run after-script (optional)
```

### Key Modules

- **`src/commands/`** — oclif CLI commands. All extend `BaseCommand` (`src/base-command.ts`) which provides config loading, token resolution, and telemetry. The `build` command is the main workhorse.
- **`src/languages/`** — Language generators implementing `LanguageGenerator` interface (in `types.ts`). Each language (TypeScript, JavaScript, Swift, Kotlin) has a generator that coordinates Quicktype for type generation and Handlebars templates for SDK wrappers.
- **`src/languages/templates/{language}/{sdk}.hbs`** — Handlebars templates that generate SDK-specific wrapper functions (e.g., `trackOrderCompleted()`).
- **`src/api/`** — Segment Public API client (`api.ts` uses `got`) and tracking plan loading/sanitization (`trackingplans.ts`). Handles pagination, auth, and JSON Schema fixups.
- **`src/config/`** — `typewriter.yml` loading/validation, token resolution (piped input → token script → `~/.typewriter` file).
- **`src/hooks/prerun/load-languages.ts`** — Registers all language generators before command execution.
- **`src/telemetry/`** — Typewriter dogfoods its own generated client for usage tracking.

### Adding a New Language

1. Create generator in `src/languages/{language}.ts` implementing `LanguageGenerator`
2. Configure a Quicktype custom renderer
3. Create Handlebars templates in `src/languages/templates/{language}/`
4. Register in `src/hooks/prerun/load-languages.ts`

## Code Style

- TypeScript strict mode, StandardJS style via ESLint (`standard-with-typescript`)
- 2-space indentation, camelCase for variables/functions, PascalCase for types/classes
- Hyphenated lowercase filenames (e.g., `base-command.ts`)
- Test files: `*.test.ts` using Jest + ts-jest

## Conventions

- Commit messages: short imperative subjects with `feat:`, `fix:`, `chore:` prefixes
- Config file: `typewriter.yml` in project root
- Local dev entry point: `./bin/dev` (no build needed); production: `./bin/run` (needs build)
- Integration fixtures in `test/env/`; generated test outputs in `test-env/` (gitignored)
