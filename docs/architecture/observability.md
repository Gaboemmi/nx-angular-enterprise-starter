# Observability

Observability is a platform capability, not a feature-specific SDK dependency.
It provides structured logs, client errors, performance signals and correlation
with backend requests through an application-owned contract.

Features may emit meaningful business-safe events and contextual metadata, but
must not import a vendor SDK or send PII, credentials, access tokens, free-form
user input or sensitive business data. Sampling, retention, redaction and vendor
configuration belong to infrastructure and deployment configuration.

Unexpected failures are reported once at their appropriate boundary. Expected
validation and authorization outcomes are modeled normally rather than reported
as application crashes. Tests use a no-op or recording adapter.

