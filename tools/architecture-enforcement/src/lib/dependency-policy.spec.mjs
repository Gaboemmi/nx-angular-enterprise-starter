import { describe, expect, it } from 'vitest';
import { hasBannedImport } from '../../../../node_modules/@nx/eslint-plugin/dist/src/utils/runtime-lint-utils.js';

import {
  PROJECT_TYPES,
  createDependencyConstraints,
  isProjectDependencyAllowed,
} from './dependency-policy.mjs';

const businessScopes = ['orders', 'billing'];

describe('architecture dependency policy', () => {
  it('creates one exact scope constraint per bounded context', () => {
    const constraints = createDependencyConstraints(businessScopes);

    expect(constraints).toContainEqual({
      sourceTag: 'scope:orders',
      onlyDependOnLibsWithTags: ['scope:orders', 'scope:platform', 'scope:shared'],
    });
    expect(constraints).toContainEqual({
      sourceTag: 'scope:billing',
      onlyDependOnLibsWithTags: ['scope:billing', 'scope:platform', 'scope:shared'],
    });
  });

  it.each([
    {
      name: 'cross-context imports',
      sourceTags: ['scope:orders', 'type:application'],
      targetTags: ['scope:billing', 'type:domain'],
    },
    {
      name: 'feature-to-feature imports',
      sourceTags: ['scope:orders', 'type:feature'],
      targetTags: ['scope:orders', 'type:feature'],
    },
    {
      name: 'app-to-feature imports',
      sourceTags: ['scope:app', 'type:app'],
      targetTags: ['scope:orders', 'type:feature'],
    },
    {
      name: 'domain-to-infrastructure imports',
      sourceTags: ['scope:orders', 'type:domain'],
      targetTags: ['scope:orders', 'type:infrastructure'],
    },
    {
      name: 'ui-to-infrastructure imports',
      sourceTags: ['scope:orders', 'type:ui'],
      targetTags: ['scope:orders', 'type:infrastructure'],
    },
    {
      name: 'app-to-context-ui imports',
      sourceTags: ['scope:app', 'type:app'],
      targetTags: ['scope:orders', 'type:ui'],
    },
    {
      name: 'e2e-to-context-shell imports',
      sourceTags: ['scope:app', 'type:e2e'],
      targetTags: ['scope:orders', 'type:shell'],
    },
    {
      name: 'shared-to-platform imports',
      sourceTags: ['scope:shared', 'type:util'],
      targetTags: ['scope:platform', 'type:util'],
    },
    {
      name: 'platform-to-business imports',
      sourceTags: ['scope:platform', 'type:platform'],
      targetTags: ['scope:orders', 'type:domain'],
    },
  ])('rejects $name', ({ sourceTags, targetTags }) => {
    expect(isProjectDependencyAllowed({ businessScopes, sourceTags, targetTags })).toBe(false);
  });

  it('allows infrastructure to implement domain contracts inside its context', () => {
    expect(
      isProjectDependencyAllowed({
        businessScopes,
        sourceTags: ['scope:orders', 'type:infrastructure'],
        targetTags: ['scope:orders', 'type:domain'],
      }),
    ).toBe(true);
  });

  it.each([
    {
      name: 'app-to-shell composition',
      sourceTags: ['scope:app', 'type:app'],
      targetTags: ['scope:orders', 'type:shell'],
    },
    {
      name: 'shell-to-feature composition',
      sourceTags: ['scope:orders', 'type:shell'],
      targetTags: ['scope:orders', 'type:feature'],
    },
    {
      name: 'shell-to-infrastructure composition',
      sourceTags: ['scope:orders', 'type:shell'],
      targetTags: ['scope:orders', 'type:infrastructure'],
    },
    {
      name: 'feature-to-application orchestration',
      sourceTags: ['scope:orders', 'type:feature'],
      targetTags: ['scope:orders', 'type:application'],
    },
    {
      name: 'ui-to-domain types',
      sourceTags: ['scope:orders', 'type:ui'],
      targetTags: ['scope:orders', 'type:domain'],
    },
    {
      name: 'business-to-platform services',
      sourceTags: ['scope:orders', 'type:feature'],
      targetTags: ['scope:platform', 'type:platform'],
    },
    {
      name: 'business-to-shared utilities',
      sourceTags: ['scope:orders', 'type:domain'],
      targetTags: ['scope:shared', 'type:util'],
    },
  ])('allows $name', ({ sourceTags, targetTags }) => {
    expect(isProjectDependencyAllowed({ businessScopes, sourceTags, targetTags })).toBe(true);
  });

  it('blocks RxJS package and subpath imports from domain projects', () => {
    const constraints = createDependencyConstraints(businessScopes);
    const domainConstraint = constraints.find(
      (constraint) => constraint.sourceTag === 'type:domain',
    );

    expect(domainConstraint.bannedExternalImports).toEqual(
      expect.arrayContaining(['rxjs', 'rxjs/**']),
    );
    expect(
      hasBannedImport(
        { name: 'orders-domain', type: 'lib', data: { tags: ['type:domain'] } },
        { name: 'npm:rxjs', type: 'npm', data: { packageName: 'rxjs' } },
        constraints,
        'rxjs/operators',
      ),
    ).toBe(domainConstraint);
  });

  it('defines an outbound policy for every supported project type', () => {
    const constraints = createDependencyConstraints(businessScopes);

    expect(
      PROJECT_TYPES.every((type) =>
        constraints.some((constraint) => constraint.sourceTag === `type:${type}`),
      ),
    ).toBe(true);
  });
});
