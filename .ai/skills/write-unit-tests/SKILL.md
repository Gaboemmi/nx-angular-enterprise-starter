# Write unit tests

## Use when

Adding or changing behavior that should be verified below the e2e level.

## Steps

1. Choose the narrowest test scope that protects the behavior: domain rules, use-case orchestration, mapper transformation, store transition, facade orchestration, datasource contract, or observable component behavior.
2. State the observable behavior and edge cases before arranging the test. Avoid tests that only assert private implementation details.
3. Replace ports, HTTP, generated clients, translation providers, and other external systems with deterministic doubles.
4. Test invalid states, error paths, boundary values, and state transitions when they are part of the contract.
5. Keep domain and application tests independent of Angular when possible. Use Angular test utilities only for Angular behavior.
6. Keep fixtures minimal, named in domain language, and local to the feature under test unless they are genuinely shared.

## Validate

1. Run the affected project's test target, for example `npx nx test <project>`.
2. Run `npx nx lint <project>` after TypeScript changes.
3. Review whether the test would still pass if the required behavior regressed; add an e2e or contract test only for a cross-boundary critical flow.
