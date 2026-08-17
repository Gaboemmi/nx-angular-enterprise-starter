import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface ShellGeneratorSchema {
  name: string;
  directory?: string;
}

export default async function shellGenerator(
  tree: Tree,
  options: ShellGeneratorSchema,
): Promise<void> {
  const context = names(options.name);
  const directory = joinPathFragments(
    options.directory ?? 'libs/domains',
    context.fileName,
    'shell',
  );
  const projectName = `${context.fileName}-shell`;

  await libraryGenerator(tree, {
    name: projectName,
    directory,
    importPath: `@nx-angular-enterprise-starter/${context.fileName}/shell`,
    linter: 'eslint',
    skipFormat: true,
    skipModule: true,
    standalone: false,
    style: 'scss',
    tags: 'scope:domain,type:shell',
    unitTestRunner: 'none',
  });

  const project = readProjectConfiguration(tree, projectName);
  project.tags = ['scope:domain', 'type:shell'];
  updateProjectConfiguration(tree, projectName, project);

  const sourceRoot = joinPathFragments(directory, 'src');
  const generatorDirectory = dirname(fileURLToPath(import.meta.url));
  generateFiles(tree, joinPathFragments(generatorDirectory, 'files'), sourceRoot, {
    ...context,
    tmpl: '',
  });
  await formatFiles(tree);
}
