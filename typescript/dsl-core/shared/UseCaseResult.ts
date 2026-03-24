import { assertThatResult, Result } from '@optivem/commons';
import { UseCaseContext } from './UseCaseContext.js';

export class UseCaseResult<
  TSuccessResponse,
  TFailureResponse,
  TSuccessVerification,
  TFailureVerification
> {
  private readonly result: Result<TSuccessResponse, TFailureResponse>;
  private readonly context: UseCaseContext;
  private readonly verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification;
  private readonly failureVerificationFactory: (error: TFailureResponse, context: UseCaseContext) => TFailureVerification;

  constructor(
    result: Result<TSuccessResponse, TFailureResponse>,
    context: UseCaseContext,
    verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification,
    failureVerificationFactory: (error: TFailureResponse, context: UseCaseContext) => TFailureVerification
  ) {
    this.result = result;
    this.context = context;
    this.verificationFactory = verificationFactory;
    this.failureVerificationFactory = failureVerificationFactory;
  }

  shouldSucceed(): TSuccessVerification {
    assertThatResult(this.result).isSuccess();
    const value = this.result.getValue();
    return this.verificationFactory(value, this.context);
  }

  shouldFail(): TFailureVerification {
    assertThatResult(this.result).isFailure();
    const error = this.result.getError();
    return this.failureVerificationFactory(error, this.context);
  }
}