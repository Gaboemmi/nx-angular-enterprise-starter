export const RESERVED_SCOPES = ['app', 'platform', 'shared'];

export const PROJECT_TYPES = [
  'app',
  'application',
  'domain',
  'e2e',
  'feature',
  'infrastructure',
  'platform',
  'shell',
  'ui',
  'util',
];

const normalizedBusinessScopes = (businessScopes) =>
  [...new Set(businessScopes)].sort((left, right) => left.localeCompare(right));

export function assertValidBusinessScopes(businessScopes) {
  for (const scope of businessScopes) {
    if (!/^[a-z][a-z0-9-]*$/.test(scope)) {
      throw new Error(`Invalid bounded-context scope: ${scope}`);
    }

    if (RESERVED_SCOPES.includes(scope)) {
      throw new Error(`Bounded-context scope is reserved: ${scope}`);
    }
  }
}

export function createScopeConstraints(businessScopes) {
  const scopes = normalizedBusinessScopes(businessScopes);
  assertValidBusinessScopes(scopes);
  const businessTags = scopes.map((scope) => `scope:${scope}`);

  return [
    {
      sourceTag: 'scope:app',
      onlyDependOnLibsWithTags: ['scope:app', ...businessTags, 'scope:platform', 'scope:shared'],
    },
    {
      sourceTag: 'scope:platform',
      onlyDependOnLibsWithTags: ['scope:platform', 'scope:shared'],
    },
    {
      sourceTag: 'scope:shared',
      onlyDependOnLibsWithTags: ['scope:shared'],
    },
    ...scopes.map((scope) => ({
      sourceTag: `scope:${scope}`,
      onlyDependOnLibsWithTags: [`scope:${scope}`, 'scope:platform', 'scope:shared'],
    })),
  ];
}

export const TYPE_CONSTRAINTS = [
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: ['type:shell', 'type:platform', 'type:ui', 'type:util'],
  },
  {
    sourceTag: 'type:e2e',
    onlyDependOnLibsWithTags: ['type:app', 'type:platform', 'type:ui', 'type:util'],
  },
  {
    sourceTag: 'type:shell',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:application',
      'type:domain',
      'type:infrastructure',
      'type:platform',
      'type:ui',
      'type:util',
    ],
    bannedExternalImports: ['@angular/common/http'],
  },
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: [
      'type:application',
      'type:domain',
      'type:platform',
      'type:ui',
      'type:util',
    ],
    bannedExternalImports: ['@angular/common/http'],
  },
  {
    sourceTag: 'type:domain',
    onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
    bannedExternalImports: ['@angular/**', '@ngrx/**', 'rxjs', 'rxjs/**'],
  },
  {
    sourceTag: 'type:application',
    onlyDependOnLibsWithTags: ['type:application', 'type:domain', 'type:util'],
    bannedExternalImports: ['@angular/common/http', '@angular/forms', '@angular/router'],
  },
  {
    sourceTag: 'type:infrastructure',
    onlyDependOnLibsWithTags: [
      'type:infrastructure',
      'type:application',
      'type:domain',
      'type:platform',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:domain', 'type:util'],
    bannedExternalImports: ['@angular/common/http', '@angular/router', '@ngrx/**'],
  },
  {
    sourceTag: 'type:platform',
    onlyDependOnLibsWithTags: ['type:platform', 'type:util'],
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util'],
  },
];

export function createDependencyConstraints(businessScopes) {
  return [...createScopeConstraints(businessScopes), ...TYPE_CONSTRAINTS];
}

const hasAnyTag = (tags, allowedTags) => allowedTags.some((tag) => tags.includes(tag));

export function isProjectDependencyAllowed({ businessScopes, sourceTags, targetTags }) {
  const constraints = createDependencyConstraints(businessScopes).filter((constraint) =>
    sourceTags.includes(constraint.sourceTag),
  );

  const satisfiesNxConstraints = constraints.every((constraint) =>
    hasAnyTag(targetTags, constraint.onlyDependOnLibsWithTags),
  );

  if (!satisfiesNxConstraints) {
    return false;
  }

  const sourceScope = sourceTags.find((tag) => tag.startsWith('scope:'))?.slice('scope:'.length);
  const sourceType = sourceTags.find((tag) => tag.startsWith('type:'))?.slice('type:'.length);
  const targetScope = targetTags.find((tag) => tag.startsWith('scope:'))?.slice('scope:'.length);
  const targetType = targetTags.find((tag) => tag.startsWith('type:'))?.slice('type:'.length);

  if (!sourceScope || !sourceType || !targetScope || !targetType) {
    return false;
  }

  if (sourceScope === 'app' && businessScopes.includes(targetScope)) {
    return sourceType === 'app' && targetType === 'shell';
  }

  return true;
}
