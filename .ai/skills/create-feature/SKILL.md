# Create feature

## Use when

Adding a business capability, route-level area, or feature library.

## Steps

1. Name the capability in domain language and confirm its owning domain; do not create a generic technical feature.
2. Decide the smallest shape that solves the need: component-local state for simple UI, or explicit domain, application, infrastructure, and presentation responsibilities when complexity justifies them.
3. Create a tagged Nx library when a library boundary is needed. Use one `scope:*` tag and one responsibility `type:*` tag from `docs/architecture/enforcement.md`.
4. Keep the public entry point minimal. Do not let another feature import internal files; define an explicit contract when domains must communicate.
5. Add only the supporting use cases, ports, mappers, datasource, store, or facade that have a concrete responsibility. Follow the respective skill when adding one.

## Validate

1. Check the intended dependency direction in `docs/architecture/ddd.md` and the Nx tags before importing across libraries.
2. Run `npx nx lint <project>` and the affected unit tests.
3. Build the affected application or library when its public API or configuration changed.
4. Review the public API, tags, and diff for accidental cross-feature or presentation-to-infrastructure dependencies.
