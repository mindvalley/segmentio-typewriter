# Thanks for taking the time to contribute to Typewriter!

This doc provides a walkthrough of developing on, and contributing to, Typewriter.

Please see our [issue template](ISSUE_TEMPLATE.md) for issues specifically.

## Issues, Bugfixes and New Language Support

Have an idea for improving Typewriter? [Submit an issue first](https://github.com/mindvalley/segmentio-typewriter/issues/new), and we'll be happy to help you scope it out and make sure it is a good fit for Typewriter.

## Developing on Typewriter

### Adding a New Language Target

> Before working towards adding a new language target, please [open an issue on GitHub](https://github.com/mindvalley/segmentio-typewriter/issues/new) that walks through your proposal for the new language support. See the [issue template](ISSUE_TEMPLATE.md) for details.

### Build and run locally

```sh
# Use node version defined in .nvmrc
$ nvm use
# Install dependencies
$ pnpm install
# Test your Typewriter installation by regenerating Typewriter's typewriter client.
$ pnpm build && ./bin/dev build
```

### Running Tests

```sh
$ pnpm test
```

### Deploying

Releases are published via GitHub Releases when a version tag is pushed.

1. Bump the version in `package.json`.
2. Run `pnpm build` and commit any changes under `src/telemetry/`.
3. Commit the version bump.
4. Tag the commit as `vX.Y.Z` and push tags.
5. GitHub Actions builds, tests, and publishes the release assets.

## Notes on JSON Schema AST

JSON Schema is a large spec, but Typewriter aims to support just the subset of JSON Schema that is relevant code generation across multiple languages:

- Field Types: `string`, `integer`, `number`, `boolean`, `any`, `array`, `object`
- Union Types
- Enums: `enum`/`const`
- Required vs. optional `object` properties
- `null`-able fields
- Descriptions
- Nested objects and arrays

It also aims to handle:
- language-specific name sanitization
- name conflicts from loading `N` schemas
- shared interfaces, when identical

The following JSON Schema constructs cannot be reliably code-gened into compile-time types, so we don't plan to support them:
- combined schemas: `oneOf`, `anyOf`, `allOf`, `not`
- various type-specific vields:
  - `string`: `length`, `pattern`, `format`
  - `integer`/`number`: `multipleOf`, `minimum`/`exclusiveMinimum`/`maximum`/`exclusiveMaximum`
  - `object`: `additionalProperties`, `propertyNames`, `minProperties`, `maxProperties`, `dependencies`, `patternProperties`
  - `array`: `contains`, tuple validation, `additionalItems`, `minItems`, `maxItems`, `uniqueItems`
- media encodings: `contentMediaType`, `contentEncoding`
- conditional schemas: `if`/`then`/`else`

We could explore supporting the following JSON Schema constructs in the future:
- annotations: `default` (default values) and `examples` (documentation of example values)
- definitions and references: `definitions`, `$ref`

However, Typewriter will still perform full JSON Schema validation at run-time, so you can catch these errors using unit tests.
