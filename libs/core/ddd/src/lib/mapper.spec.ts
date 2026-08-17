import { describe, expect, it } from 'vitest';

import { Mapper } from './mapper';

class NumberToTextMapper extends Mapper<number, string> {
  map(source: number): string {
    return `value-${String(source)}`;
  }
}

describe('Mapper', () => {
  it('maps a single item', () => {
    const mapper = new NumberToTextMapper();

    expect(mapper.map(42)).toBe('value-42');
  });

  it('maps every item without mutating the source array', () => {
    const source = [1, 2] as const;
    const mapper = new NumberToTextMapper();

    expect(mapper.mapArray(source)).toEqual(['value-1', 'value-2']);
    expect(source).toEqual([1, 2]);
  });
});
