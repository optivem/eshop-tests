import { UseCaseContext } from './UseCaseContext.js';

export class ResponseVerification<TResponse> {
  protected readonly response: TResponse;
  protected readonly context: UseCaseContext;

  constructor(response: TResponse, context: UseCaseContext) {
    this.response = response;
    this.context = context;
  }

  getResponse(): TResponse {
    return this.response;
  }

  getContext(): UseCaseContext {
    return this.context;
  }
}