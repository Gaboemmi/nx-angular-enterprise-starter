/**
 * Defines one application operation.
 *
 * `Output` is deliberately unconstrained so a use case can be synchronous,
 * promise-based, or return a stream without coupling this core primitive to a
 * specific asynchronous library.
 */
export interface UseCase<Input, Output> {
  execute(input: Input): Output;
}
