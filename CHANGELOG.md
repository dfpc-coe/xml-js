# CHANGELOG

## Emoji Cheatsheet
- :pencil2: doc updates
- :bug: when fixing a bug
- :rocket: when making general improvements
- :white_check_mark: when adding tests
- :arrow_up: when upgrading dependencies
- :tada: when adding new features

### v2.0.3

- :bug: Resync Version

### v2.0.1

- :bug: Fully escape XML special characters (`&`, `<`, `>`, `"`) in attribute values during `js2xml` serialization; previously only `"` was escaped, so an unescaped `&`/`<` produced malformed XML
- :white_check_mark: Add attribute value encoding tests (including a round-trip and a no-double-escape case)

### v2.0.0

- :rocket: Modernize the codebase to TypeScript + ESM (matches the `node-cot` / `node-safeurl` house style)
- :rocket: Replace the Webpack/Babel build with `tsc` emitting `dist/`
- :white_check_mark: Port the test suite to `node:test` + `tsx` with `c8` coverage
- :arrow_up: Replace ESLint 5 / `.eslintrc.json` with ESLint 10 flat config + `typescript-eslint`
- :arrow_up: Refresh tooling (`typedoc`, GitHub Actions) and drop legacy CI configs
- Public API, behavior, and test expectations are unchanged
