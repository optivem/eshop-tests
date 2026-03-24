import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';
import { expect } from '@playwright/test';

export class SystemErrorFailureVerification extends ResponseVerification<SystemError> {
    constructor(error: SystemError, context: UseCaseContext) {
        super(error, context);
    }

    errorMessage(expectedMessage: string): SystemErrorFailureVerification {
        const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
        const error = this.response;
        const errorMessage = error.message;
        expect(errorMessage, `Expected error message: '${expandedExpectedMessage}', but got: '${errorMessage}'`).toBe(
            expandedExpectedMessage
        );
        return this;
    }

    fieldErrorMessage(expectedField: string, expectedMessage: string): SystemErrorFailureVerification {
        const expandedExpectedField = this.context.expandAliases(expectedField);
        const expandedExpectedMessage = this.context.expandAliases(expectedMessage);
        const error = this.response;
        const fields = error.fields;
        expect(fields, 'Expected field errors but none were found').toBeDefined();
        expect(fields!.length, 'Expected field errors but array was empty').toBeGreaterThan(0);
        const matchingFieldError = fields!.find((f) => f.field === expandedExpectedField);
        expect(
            matchingFieldError,
            `Expected field error for field '${expandedExpectedField}', but field was not found in errors: ${JSON.stringify(fields)}`
        ).toBeDefined();
        const actualMessage = matchingFieldError!.message;
        expect(
            actualMessage,
            `Expected field error message for field '${expandedExpectedField}': '${expandedExpectedMessage}', but got: '${actualMessage}'`
        ).toBe(expandedExpectedMessage);
        return this;
    }
}


