import { createProjectGraphAsync } from '@nx/devkit';
import { readFile } from 'node:fs/promises';

import { validateProjectDependencies, validateProjectTags } from './lib/project-tags.mjs';

const businessScopes = JSON.parse(
  await readFile(new URL('../business-scopes.json', import.meta.url), 'utf8'),
);
const graph = await createProjectGraphAsync();
const projects = Object.values(graph.nodes).map((node) => ({
  name: node.name,
  root: node.data.root,
  tags: node.data.tags ?? [],
}));
const dependencies = Object.values(graph.dependencies).flat();
const issues = [
  ...validateProjectTags(projects, businessScopes),
  ...validateProjectDependencies(projects, dependencies, businessScopes),
];

if (issues.length > 0) {
  console.error(issues.map((issue) => `- ${issue}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Architecture tags valid for ${projects.length} projects.`);
}
