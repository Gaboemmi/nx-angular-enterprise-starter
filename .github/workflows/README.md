# CI is intentionally disabled

This starter does not enable a CI provider by default. The GitHub Actions
template lives at [`docs/templates/github-actions-ci.yml`](../../docs/templates/github-actions-ci.yml)
so GitHub cannot execute it.

When adopting the starter, choose the CI provider deliberately:

- **GitHub Actions:** copy the template to `.github/workflows/ci.yml`, configure
  the optional SonarQube Cloud variables and secret, then commit it.
- **Azure Pipelines:** create an equivalent `azure-pipelines.yml` for the
  organization; do not also enable the GitHub Actions template unless both
  pipelines are intentional.
- **No CI yet:** leave the template where it is and run the relevant Nx targets
  locally.

Agents follow [the CI adoption procedure](../../.ai/skills/adopt-ci/SKILL.md)
when a provider is selected.

The template validates the architecture policy, then runs lint, unit tests and
builds for all projects on pull requests and pushes to `main`. It also runs
SonarQube Cloud only when its repository variables and secret are configured.
