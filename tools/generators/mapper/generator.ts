import { formatFiles, generateFiles, joinPathFragments, names } from '@nx/devkit';
import type { Tree } from '@nx/devkit';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface MapperGeneratorSchema {
  name: string;
  directory: string;
}

function findToSeparatorIndex(className: string): number {
  for (let i = 1; i < className.length - 1; i++) {
    if (className[i] === 'T' && className[i + 1] === 'o' && /[a-z]/.test(className[i - 1])) {
      return i;
    }
  }
  return -1;
}

function parseMapperName(name: string): { dtoName: string; domainName: string } {
  const className = names(name).className;
  const toIndex = findToSeparatorIndex(className);

  if (toIndex <= 0) {
    throw new Error(
      `Mapper name must follow the pattern {Source}To{Target}, got "${name}". ` +
        `Examples: TripDtoToTrip, InvoiceToInvoiceDto`,
    );
  }

  const dtoName = className.substring(0, toIndex);
  const domainName = className.substring(toIndex + 2);

  if (!dtoName || !domainName) {
    throw new Error(
      `Mapper name must have both Source and Target parts, got "${name}". ` +
        `Examples: TripDtoToTrip, InvoiceToInvoiceDto`,
    );
  }

  return { dtoName, domainName };
}

function upsertIndexExport(tree: Tree, indexPath: string, exportPath: string): void {
  const exportLine = `export * from '${exportPath}';`;

  if (tree.exists(indexPath)) {
    const content = tree.read(indexPath, 'utf-8') ?? '';
    if (!content.includes(exportLine)) {
      const trimmed = content.trimEnd();
      tree.write(indexPath, `${trimmed}\n${exportLine}\n`);
    }
  } else {
    tree.write(indexPath, `${exportLine}\n`);
  }
}

export default async function mapperGenerator(
  tree: Tree,
  options: MapperGeneratorSchema,
): Promise<void> {
  const { dtoName } = parseMapperName(options.name);
  const fullContext = names(options.name);
  const dtoContext = names(dtoName);

  const subDirectory = joinPathFragments(options.directory, `${dtoContext.fileName}-to`);

  const generatorDirectory = dirname(fileURLToPath(import.meta.url));
  generateFiles(tree, joinPathFragments(generatorDirectory, 'files'), subDirectory, {
    ...fullContext,
    tmpl: '',
  });

  const indexPath = joinPathFragments(options.directory, 'index.ts');
  const exportPath = `./${dtoContext.fileName}-to/${fullContext.fileName}.mapper`;
  upsertIndexExport(tree, indexPath, exportPath);

  await formatFiles(tree);
}
