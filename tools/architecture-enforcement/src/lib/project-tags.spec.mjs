import { describe, expect, it } from 'vitest';

import { validateProjectDependencies, validateProjectTags } from './project-tags.mjs';

describe('project tag validation', () => {
  it('accepts registered bounded-context and reserved scopes', () => {
    expect(
      validateProjectTags(
        [
          {
            name: 'orders-shell',
            root: 'libs/domains/orders/shell',
            tags: ['scope:orders', 'type:shell'],
          },
          {
            name: 'core-ddd',
            root: 'libs/core/ddd',
            tags: ['scope:shared', 'type:util'],
          },
        ],
        ['orders'],
      ),
    ).toEqual([]);
  });

  it('rejects unregistered, misplaced, missing and unsupported tags', () => {
    expect(
      validateProjectTags(
        [
          {
            name: 'billing-domain',
            root: 'libs/domains/orders/domain',
            tags: ['scope:billing', 'type:unknown'],
          },
          { name: 'untagged', root: 'libs/untagged', tags: [] },
        ],
        ['billing'],
      ),
    ).toEqual([
      'billing-domain uses unsupported type:unknown',
      'billing-domain must live under libs/domains/billing',
      'untagged must declare exactly one scope:* tag',
      'untagged must declare exactly one type:* tag',
    ]);
  });

  it('rejects invalid matrix cells and reserved-scope escape hatches', () => {
    expect(
      validateProjectTags(
        [
          {
            name: 'orders-as-shared',
            root: 'libs/domains/orders/domain',
            tags: ['scope:shared', 'type:domain'],
          },
          {
            name: 'platform-shell',
            root: 'libs/core/platform-shell',
            tags: ['scope:platform', 'type:shell'],
          },
          {
            name: 'orders-app',
            root: 'libs/domains/orders/app',
            tags: ['scope:orders', 'type:app'],
          },
        ],
        ['orders'],
      ),
    ).toEqual([
      'orders-as-shared under libs/domains must use a registered business scope',
      'platform-shell cannot combine scope:platform with type:shell',
      'orders-app cannot combine scope:orders with type:app',
    ]);
  });

  it('rejects a stale registered scope without a project', () => {
    expect(validateProjectTags([], ['orders'])).toEqual(['scope:orders is registered but unused']);
  });

  it('checks exact scope/type combinations on real project dependencies', () => {
    const projects = [
      { name: 'app', tags: ['scope:app', 'type:app'] },
      { name: 'orders-shell', tags: ['scope:orders', 'type:shell'] },
      { name: 'orders-ui', tags: ['scope:orders', 'type:ui'] },
    ];

    expect(
      validateProjectDependencies(
        projects,
        [
          { source: 'app', target: 'orders-shell' },
          { source: 'app', target: 'orders-ui' },
        ],
        ['orders'],
      ),
    ).toEqual(['app must not depend on orders-ui']);
  });
});
