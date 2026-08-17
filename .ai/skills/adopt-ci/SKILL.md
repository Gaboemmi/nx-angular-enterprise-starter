# Adopt CI

Use this procedure when a team wants to enable continuous integration for this
starter or switch CI providers.

## Steps

1. Confirm the selected provider, repository host, target branches, required
   checks, and who will configure provider secrets and variables.
2. Read [the enforcement policy](../../../docs/architecture/enforcement.md) and
   [the CI adoption guide](../../../.github/workflows/README.md).
3. Keep CI disabled until the provider is explicitly selected.
4. For GitHub Actions, copy
   `docs/templates/github-actions-ci.yml` to `.github/workflows/ci.yml` and
   configure the optional SonarQube Cloud variables and `SONAR_TOKEN` secret in
   the repository settings.
5. For Azure Pipelines, create an equivalent `azure-pipelines.yml` that runs
   lint, unit tests, and builds through Nx. Configure secrets in Azure; do not
   enable the GitHub Actions template unless running both is intentional.
6. Update the adoption guide if the provider, triggers, or required checks
   differ from the documented baseline.

## Validate

Run `npm run format`, then validate the configured checks locally through Nx.
Review the final diff and confirm that only the selected provider can trigger
CI.
