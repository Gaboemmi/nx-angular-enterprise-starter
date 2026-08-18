import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { describe, expect, it } from 'vitest';

import mapperGenerator from './generator';

const directory = 'libs/domains/orders/infrastructure/src/lib/mappers';

describe('mapper generator', () => {
  it('creates a mapper class and spec from PascalCase name in subdirectory', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'TripDtoToTrip',
      directory,
    });

    const subDir = `${directory}/trip-dto-to`;
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.ts`)).toBe(true);
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.spec.ts`)).toBe(true);

    const content = tree.read(`${subDir}/trip-dto-to-trip.mapper.ts`, 'utf-8');
    expect(content).toContain('export class TripDtoToTrip extends Mapper');
    expect(content).toContain("import { Mapper } from '@nx-angular-enterprise-starter/core/ddd';");
  });

  it('creates a mapper class and spec from kebab-case name', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'trip-dto-to-trip',
      directory,
    });

    const subDir = `${directory}/trip-dto-to`;
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.ts`)).toBe(true);
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.spec.ts`)).toBe(true);

    const content = tree.read(`${subDir}/trip-dto-to-trip.mapper.ts`, 'utf-8');
    expect(content).toContain('export class TripDtoToTrip extends Mapper');
  });

  it('creates a mapper class and spec from camelCase name', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'tripDtoToTrip',
      directory,
    });

    const subDir = `${directory}/trip-dto-to`;
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.ts`)).toBe(true);
    expect(tree.exists(`${subDir}/trip-dto-to-trip.mapper.spec.ts`)).toBe(true);

    const content = tree.read(`${subDir}/trip-dto-to-trip.mapper.ts`, 'utf-8');
    expect(content).toContain('export class TripDtoToTrip extends Mapper');
  });

  it('creates the target directory if it does not exist', async () => {
    const tree = createTreeWithEmptyWorkspace();
    const customDir = 'libs/domains/billing/infrastructure/src/lib/mappers';

    await mapperGenerator(tree, {
      name: 'InvoiceToInvoiceDto',
      directory: customDir,
    });

    expect(tree.exists(`${customDir}/invoice-to/invoice-to-invoice-dto.mapper.ts`)).toBe(true);
  });

  it('generates a spec file with a matching describe block and correct import', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'OrderDtoToOrder',
      directory,
    });

    const subDir = `${directory}/order-dto-to`;
    const spec = tree.read(`${subDir}/order-dto-to-order.mapper.spec.ts`, 'utf-8');
    expect(spec).toContain("describe('OrderDtoToOrder'");
    expect(spec).toContain("import { OrderDtoToOrder } from './order-dto-to-order.mapper';");
  });

  it('generates a mapper file that throws by default', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'PaymentDtoToPayment',
      directory,
    });

    const subDir = `${directory}/payment-dto-to`;
    const content = tree.read(`${subDir}/payment-dto-to-payment.mapper.ts`, 'utf-8');
    expect(content).toContain("throw new Error('Not implemented')");
  });

  it('creates index.ts with the mapper export', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'TripDtoToTrip',
      directory,
    });

    const index = tree.read(`${directory}/index.ts`, 'utf-8');
    expect(index).toContain("export * from './trip-dto-to/trip-dto-to-trip.mapper';");
  });

  it('appends to existing index.ts without duplicating', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'TripDtoToTrip',
      directory,
    });
    await mapperGenerator(tree, {
      name: 'TripDtoToTrip',
      directory,
    });

    const index = tree.read(`${directory}/index.ts`, 'utf-8');
    const matches = index.match(/export \* from '\.\/trip-dto-to\/trip-dto-to-trip\.mapper';/g);
    expect(matches).toHaveLength(1);
  });

  it('adds multiple exports to index.ts for different mappers', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'TripDtoToTrip',
      directory,
    });
    await mapperGenerator(tree, {
      name: 'InvoiceToInvoiceDto',
      directory,
    });

    const index = tree.read(`${directory}/index.ts`, 'utf-8');
    expect(index).toContain("export * from './trip-dto-to/trip-dto-to-trip.mapper';");
    expect(index).toContain("export * from './invoice-to/invoice-to-invoice-dto.mapper';");
  });

  it('throws an error when name does not contain To separator', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await expect(mapperGenerator(tree, { name: 'TripMapper', directory })).rejects.toThrow(
      'Mapper name must follow the pattern {Source}To{Target}',
    );
  });

  it('throws an error when name starts with To and has no target', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await expect(mapperGenerator(tree, { name: 'To', directory })).rejects.toThrow(
      'Mapper name must follow the pattern {Source}To{Target}',
    );
  });

  it('throws an error when name has only source before To', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await expect(mapperGenerator(tree, { name: 'TripTo', directory })).rejects.toThrow(
      'Mapper name must have both Source and Target parts',
    );
  });

  it('correctly parses domain name from target side', async () => {
    const tree = createTreeWithEmptyWorkspace();

    await mapperGenerator(tree, {
      name: 'InvoiceToInvoiceDto',
      directory,
    });

    const subDir = `${directory}/invoice-to`;
    expect(tree.exists(`${subDir}/invoice-to-invoice-dto.mapper.ts`)).toBe(true);

    const content = tree.read(`${subDir}/invoice-to-invoice-dto.mapper.ts`, 'utf-8');
    expect(content).toContain('export class InvoiceToInvoiceDto extends Mapper');
  });
});
