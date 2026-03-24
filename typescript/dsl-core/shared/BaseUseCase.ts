import { UseCase } from './UseCase.js';
import { UseCaseContext } from './UseCaseContext.js';
import { UseCaseResult } from './UseCaseResult.js';

export abstract class BaseUseCase<
  TDriver,
  TSuccessResponse,
  TFailureResponse,
  TSuccessVerification,
  TFailureVerification
> implements UseCase<UseCaseResult<TSuccessResponse, TFailureResponse, TSuccessVerification, TFailureVerification>> {
  protected readonly driver: TDriver;
  protected readonly context: UseCaseContext;

  protected constructor(driver: TDriver, context: UseCaseContext) {
    this.driver = driver;
    this.context = context;
  }

  abstract execute(): Promise<UseCaseResult<TSuccessResponse, TFailureResponse, TSuccessVerification, TFailureVerification>>;
}