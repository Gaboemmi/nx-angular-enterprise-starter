import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  readJson,
  readProjectConfiguration,
  updateProjectConfiguration,
  writeJson,
} from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ShellGeneratorSchema {
  name: string;
}

const businessScopesPath = 'tools/architecture-enforcement/business-scopes.json';

function registerBusinessScope(tree: Tree, scope: string): void {
  const scopes = tree.exists(businessScopesPath)
    ? readJson<string[]>(tree, businessScopesPath)
    : [];

  if (!scopes.includes(scope)) {
    writeJson(tree, businessScopesPath, [...scopes, scope].sort());
  }
}

export default async function shellGenerator(
  tree: Tree,
  options: ShellGeneratorSchema,
): Promise<void> {
  const context = names(options.name);
  const directory = joinPathFragments('libs/domains', context.fileName, 'shell');
  const projectName = `${context.fileName}-shell`;
  const scopeTag = `scope:${context.fileName}`;

  registerBusinessScope(tree, context.fileName);

  await libraryGenerator(tree, {
    name: projectName,
    directory,
    importPath: `@nx-angular-enterprise-starter/${context.fileName}/shell`,
    linter: 'eslint',
    skipFormat: true,
    skipModule: true,
    standalone: false,
    style: 'none',
    tags: `${scopeTag},type:shell`,
    unitTestRunner: 'none',
  });

  const project = readProjectConfiguration(tree, projectName);
  project.tags = [scopeTag, 'type:shell'];
  updateProjectConfiguration(tree, projectName, project);

  const sourceRoot = joinPathFragments(directory, 'src');
  const generatorDirectory = dirname(fileURLToPath(import.meta.url));
  generateFiles(tree, joinPathFragments(generatorDirectory, 'files'), sourceRoot, {
    ...context,
    tmpl: '',
  });
  await formatFiles(tree);
}
