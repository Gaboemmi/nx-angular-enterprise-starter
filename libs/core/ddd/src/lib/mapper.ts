/**
 * Transforms data between two architectural representations.
 */
export abstract class Mapper<From, To> {
  abstract map(source: From): To;

  mapArray(sources: readonly From[]): To[] {
    return sources.map((source) => this.map(source));
  }
}
