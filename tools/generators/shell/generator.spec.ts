import { readJson, readProjectConfiguration, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { describe, expect, it } from 'vitest';

import shellGenerator from './generator';

const businessScopesPath = 'tools/architecture-enforcement/business-scopes.json';

describe('shell generator', () => {
  it('registers and applies the bounded-context scope', async () => {
    const tree = createTreeWithEmptyWorkspace();
    writeJson(tree, businessScopesPath, ['billing']);

    await shellGenerator(tree, { name: 'Orders' });

    expect(readJson(tree, businessScopesPath)).toEqual(['billing', 'orders']);
    expect(readProjectConfiguration(tree, 'orders-shell')).toMatchObject({
      root: 'libs/domains/orders/shell',
      tags: ['scope:orders', 'type:shell'],
    });
    expect(tree.exists('libs/domains/orders/shell/src/lib/orders.routes.ts')).toBe(true);
    expect(tree.children('libs/domains/orders/shell/src/lib')).toEqual(['orders.routes.ts']);
  });
});
