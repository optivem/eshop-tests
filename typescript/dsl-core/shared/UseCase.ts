export interface UseCase<TResult> {
  execute(): Promise<TResult>;
}