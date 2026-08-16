import { describe, expect, it } from 'vitest';

import { UseCase } from './use-case';

class DoubleUseCase implements UseCase<number, number> {
  execute(input: number): number {
    return input * 2;
  }
}

describe('UseCase', () => {
  it('exposes application operations through execute', () => {
    expect(new DoubleUseCase().execute(4)).toBe(8);
  });
});
