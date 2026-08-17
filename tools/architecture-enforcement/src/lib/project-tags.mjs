import {
  PROJECT_TYPES,
  RESERVED_SCOPES,
  assertValidBusinessScopes,
  isProjectDependencyAllowed,
} from './dependency-policy.mjs';

const RESERVED_SCOPE_TYPES = {
  app: ['app', 'e2e', 'ui', 'util'],
  platform: ['platform', 'ui', 'util'],
  shared: ['domain', 'ui', 'util'],
};
const BUSINESS_SCOPE_TYPES = [
  'application',
  'domain',
  'feature',
  'infrastructure',
  'shell',
  'ui',
  'util',
];

const tagsWithPrefix = (tags, prefix) => tags.filter((tag) => tag.startsWith(prefix));

export function validateProjectTags(projects, businessScopes) {
  assertValidBusinessScopes(businessScopes);
  const registeredScopes = new Set([...RESERVED_SCOPES, ...businessScopes]);
  const issues = [];

  for (const project of projects) {
    const tags = project.tags ?? [];
    const scopeTags = tagsWithPrefix(tags, 'scope:');
    const typeTags = tagsWithPrefix(tags, 'type:');

    if (scopeTags.length !== 1) {
      issues.push(`${project.name} must declare exactly one scope:* tag`);
    }

    if (typeTags.length !== 1) {
      issues.push(`${project.name} must declare exactly one type:* tag`);
    }

    const scope = scopeTags[0]?.slice('scope:'.length);
    if (scope && !registeredScopes.has(scope)) {
      issues.push(`${project.name} uses unregistered scope:${scope}`);
    }

    const type = typeTags[0]?.slice('type:'.length);
    if (type && !PROJECT_TYPES.includes(type)) {
      issues.push(`${project.name} uses unsupported type:${type}`);
    }

    const allowedTypes = businessScopes.includes(scope)
      ? BUSINESS_SCOPE_TYPES
      : RESERVED_SCOPE_TYPES[scope];
    if (
      scope &&
      type &&
      PROJECT_TYPES.includes(type) &&
      allowedTypes &&
      !allowedTypes.includes(type)
    ) {
      issues.push(`${project.name} cannot combine scope:${scope} with type:${type}`);
    }

    if (businessScopes.includes(scope) && !project.root.startsWith(`libs/domains/${scope}/`)) {
      issues.push(`${project.name} must live under libs/domains/${scope}`);
    }

    if (project.root.startsWith('libs/domains/') && !businessScopes.includes(scope)) {
      issues.push(`${project.name} under libs/domains must use a registered business scope`);
    }
  }

  for (const scope of businessScopes) {
    if (!projects.some((project) => project.tags?.includes(`scope:${scope}`))) {
      issues.push(`scope:${scope} is registered but unused`);
    }
  }

  return issues;
}

export function validateProjectDependencies(projects, dependencies, businessScopes) {
  const projectsByName = new Map(projects.map((project) => [project.name, project]));
  const issues = [];

  for (const dependency of dependencies) {
    const source = projectsByName.get(dependency.source);
    const target = projectsByName.get(dependency.target);

    if (
      source &&
      target &&
      !isProjectDependencyAllowed({
        businessScopes,
        sourceTags: source.tags ?? [],
        targetTags: target.tags ?? [],
      })
    ) {
      issues.push(`${source.name} must not depend on ${target.name}`);
    }
  }

  return issues;
}
