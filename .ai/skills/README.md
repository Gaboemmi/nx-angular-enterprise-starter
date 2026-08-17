# Skills

A Harness skill is a short, repository-specific procedure for performing a
recurring task correctly.

Add one only when the repository has established conventions that can be stated
accurately. Keep it task-specific, procedural, actionable, and linked to real
commands or tools. Do not turn skills into framework tutorials or copies of the
architecture documentation.

For Angular conventions, use the official `angular-developer` Agent Skill.
Repository skills define only decisions that Angular cannot know: ownership,
boundaries, contracts, and validation specific to this workspace.

Use this structure:

```markdown
# Skill name

## Use when

...

## Steps

1. ...

## Validate

...
```

The initial skills establish architectural decision points without inventing
generators or physical layouts that the codebase has not adopted yet. Tighten
them with concrete commands and examples as recurring implementation patterns
become proven.

`adopt-ci` is the procedure for deliberately enabling a CI provider after a
team chooses GitHub Actions, Azure Pipelines, or another supported provider.
