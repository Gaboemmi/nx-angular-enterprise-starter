# Runtime Configuration

## Purpose

Runtime configuration contains deployment-specific, non-secret values that can
change without rebuilding the frontend: API base URLs, enabled integrations,
public telemetry endpoints and supported locale defaults.

## Lifecycle

Configuration is loaded and schema-validated before application features start.
The application exposes a typed, application-owned configuration contract;
features do not read global variables, asset files or build environment values
directly.

```text
deployment config -> validation -> platform configuration -> feature contract
```

Compile-time values are reserved for build behavior. User preferences and
business configuration have separate owners and must not be conflated with
deployment configuration.

## Security

Anything shipped to a browser is public. Secrets, private keys and privileged
credentials never belong in runtime configuration. Invalid or missing required
configuration fails startup with an actionable, safe error.

## Testing

Tests provide configuration through the platform contract. No test depends on a
deployment asset or process environment.

