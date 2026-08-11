# HTTP, API Contracts and Errors

## API boundary

OpenAPI is the frontend/backend contract. Its ownership, generation lifecycle
and mapping rules are defined in [OpenAPI Contract](openapi.md). Generated
clients and DTOs remain infrastructure code and are never exposed as domain
entities.

## HTTP responsibilities

The platform HTTP layer owns base URL resolution, authentication strategy,
correlation headers, request cancellation, timeout/retry policy and transport
normalization. A retry is allowed only for operations that are safe or explicitly
idempotent.

Features must not create competing interceptors or manually attach provider
tokens. BFF/cookie authentication remains valid because the HTTP layer does not
assume every strategy has a bearer token.

## Error model

Transport failures are normalized into application-level categories:
validation, authentication, authorization, not found, conflict, network and
unexpected failure. Domain/application code handles expected outcomes; the
platform reports unexpected failures with safe user feedback. Technical details
and sensitive server data must not be rendered to users.
