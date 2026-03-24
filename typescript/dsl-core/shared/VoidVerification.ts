import { ResponseVerification } from './ResponseVerification.js';
import { UseCaseContext } from './UseCaseContext.js';

export class VoidVerification extends ResponseVerification<void> {
  constructor(response: void, context: UseCaseContext) {
    super(response, context);
  }
}