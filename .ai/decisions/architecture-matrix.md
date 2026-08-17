# Architecture Matrix

Business Nx projects declare the bounded context as `scope:<context>` and one
canonical `type:*` responsibility. `presentation` is conceptual; Nx represents
delivery projects as `shell`, `feature`, or `ui`. Infrastructure keeps the
`type:infrastructure` name.

The matrix classifies boundaries that are justified; it never requires every
cell or architectural pattern. Create a new or ambiguous context through
`discover-domain` and register its scope when its first Nx project is added.
Use the shell generator only when the application delivers that context; it
registers the scope automatically.

See [ADR-018](../../docs/decisions/ADR-018-architecture-matrix-tags.md) and the
[executable policy](../../docs/architecture/enforcement.md).
