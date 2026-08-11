# Executable Architecture

## Nx tags

Libraries use a scope tag and a responsibility tag:

```text
scope:domain | scope:platform | scope:shared | scope:app
type:domain | type:application | type:infrastructure | type:presentation |
type:ui | type:util | type:platform
```

The application already has `scope:app,type:app`. New libraries must receive
tags when created; untagged libraries are not accepted as an escape hatch.

## Dependency policy

- `type:domain` may depend only on `type:domain` and `type:util`.
- `type:application` may use domain contracts and utilities.
- `type:infrastructure` may implement domain/application contracts and use
  platform infrastructure.
- `type:presentation` uses application APIs and UI/util libraries, never
  infrastructure directly.
- Apps compose domains, platform and shared capabilities.

These rules are enforced through `@nx/enforce-module-boundaries`. Public entry
points are the only supported cross-domain imports. When a new valid dependency
does not fit this matrix, change this document and the lint configuration in the
same pull request.

## Adoption status

An accepted ADR records a decision, not necessarily its completed implementation.
The current foundation has three states:

| Area | State | Next executable increment |
| --- | --- | --- |
| Nx boundaries | Started | Tag each new library and add boundary tests. |
| Modern Angular | Started | Keep new components OnPush and zoneless-compatible. |
| Auth, i18n, OpenAPI, design system | Designed | Implement a platform library and its test adapter before feature use. |
| Runtime config, errors, observability, authorization | Designed | Add the respective typed platform contracts. |

