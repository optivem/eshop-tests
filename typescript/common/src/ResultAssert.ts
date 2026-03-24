import { expect } from '@playwright/test';
import { Decimal } from './Decimal.js';
import { Integer } from './Integer.js';
import type { Result } from './Result.js';

/**
 * Recommended way to assert on a Result. Fluent API: throws if assertion fails.
 * Use in tests or any code that needs to assert success/failure.
 * @example assertThatResult(result).isSuccess()
 * @example assertThatResult(result).isFailure()
 * @example assertThatResult(result).isFailureWith('expected error message')
 */
export function assertThatResult<T, E>(actual: Result<T, E>): ResultAssertFluent<T, E> {
  return new ResultAssertFluent(actual);
}

class ResultAssertFluent<T, E> {
  constructor(private readonly actual: Result<T, E>) {}

  isSuccess(): this {
    if (this.actual == null) {
      throw new Error('Expected result not to be null');
    }
    if (!this.actual.isSuccess()) {
      throw new Error(`Expected result to be success but was failure with error: ${formatError(this.actual.getError())}`);
    }
    return this;
  }

  isFailure(): this {
    if (this.actual == null) {
      throw new Error('Expected result not to be null');
    }
    if (!this.actual.isFailure()) {
      throw new Error('Expected result to be failure but was success');
    }
    return this;
  }

  isFailureWith(expectedMessage: string): this {
    this.isFailure();
    const errorMessages = getErrorMessages(this.actual.getError());
    const hasMessage = errorMessages.some((msg) => msg.includes(expectedMessage));
    if (!hasMessage) {
      throw new Error(`Expected result to be failure with message "${expectedMessage}" but got: ${errorMessages.join(', ')}`);
    }
    return this;
  }
}

function formatError(error: unknown): string {
  if (error === null || error === undefined) {
    return 'unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (Array.isArray(error)) {
    return error.join(', ');
  }
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return JSON.stringify(error);
}

function getErrorMessages(error: unknown): string[] {
  if (error === null || error === undefined) {
    return [];
  }
  if (typeof error === 'string') {
    return [error];
  }
  if (Array.isArray(error)) {
    return error.map(e => typeof e === 'string' ? e : JSON.stringify(e));
  }
  if (typeof error === 'object' && 'message' in error) {
    const messages = [String((error as { message: unknown }).message)];
    if ('fields' in error && Array.isArray((error as { fields: unknown[] }).fields)) {
      const fields = (error as { fields: { field: string; message: string }[] }).fields;
      for (const field of fields) {
        messages.push(`${field.field}: ${field.message}`);
      }
    }
    return messages;
  }
  return [JSON.stringify(error)];
}

function toDecimalOrNull(value: unknown): Decimal | null {
  if (value instanceof Decimal) {
    return value;
  }
  if (typeof value === 'number') {
    return Decimal.fromString(String(value));
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Decimal.fromString(value);
  }
  if (value != null && typeof value === 'object' && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
    return Decimal.fromString(String((value as { toNumber: () => number }).toNumber()));
  }
  return null;
}

function toIntegerOrNull(value: unknown): Integer | null {
  if (value instanceof Integer) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Integer.fromNumber(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return Integer.fromString(value);
  }
  if (value != null && typeof value === 'object' && typeof (value as { toNumber?: () => number }).toNumber === 'function') {
    return Integer.fromNumber((value as { toNumber: () => number }).toNumber());
  }
  return null;
}

/**
 * Registers custom Result matchers on expect() (toBeSuccess, toBeFailureWith, etc.).
 * Use when you prefer expect(result).toBeSuccess() in a test runner. Otherwise prefer assertThatResult(result).isSuccess().
 */
export function setupResultMatchers() {
  expect.extend({
    toBeSuccess<T, E>(received: Result<T, E>) {
      const pass = received.isSuccess();

      if (pass) {
        return {
          pass: true,
          message: () => 'Expected result to be failure but was success'
        };
      } else {
        const error = received.getError();
        return {
          pass: false,
          message: () => `Expected result to be success but was failure with error: ${formatError(error)}`
        };
      }
    },

    toBeFailureWith<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));

      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to be failure with message "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to be failure with message "${expectedMessage}" but got: ${errorMessages.join(', ')}`
        };
      }
    },

    toHaveErrorMessage<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));

      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to have error message "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to have error message "${expectedMessage}" but got: ${errorMessages.join(', ')}`
        };
      }
    },

    toHaveFieldError<T, E>(received: Result<T, E>, expectedMessage: string) {
      const isFailure = received.isFailure();

      if (!isFailure) {
        return {
          pass: false,
          message: () => `Expected result to be failure but was success`
        };
      }

      const errorMessages = getErrorMessages(received.getError());
      const hasMessage = errorMessages.some(msg => msg.includes(expectedMessage));

      if (hasMessage) {
        return {
          pass: true,
          message: () => `Expected result not to have field error "${expectedMessage}"`
        };
      } else {
        return {
          pass: false,
          message: () => `Expected result to have field error "${expectedMessage}" but got: ${errorMessages.join(', ')}`
        };
      }
    },

    toEqualDecimal(received: unknown, expected: Decimal | string | number) {
      const receivedDecimal = toDecimalOrNull(received);
      const expectedDecimal = toDecimalOrNull(expected);

      if (receivedDecimal == null || expectedDecimal == null) {
        return {
          pass: false,
          message: () => `Expected both values to be decimal-compatible but got received=${String(received)} expected=${String(expected)}`
        };
      }

      const pass = receivedDecimal.equals(expectedDecimal);
      return {
        pass,
        message: () => pass
          ? `Expected decimal values not to be equal, but both were ${receivedDecimal.toString()}`
          : `Expected decimal ${receivedDecimal.toString()} to equal ${expectedDecimal.toString()}`
      };
    },

    toBeGreaterThanOrEqualDecimal(received: unknown, expected: Decimal | string | number) {
      const receivedDecimal = toDecimalOrNull(received);
      const expectedDecimal = toDecimalOrNull(expected);

      if (receivedDecimal == null || expectedDecimal == null) {
        return {
          pass: false,
          message: () => `Expected both values to be decimal-compatible but got received=${String(received)} expected=${String(expected)}`
        };
      }

      const pass = receivedDecimal.gte(expectedDecimal);
      return {
        pass,
        message: () => pass
          ? `Expected decimal ${receivedDecimal.toString()} to be less than ${expectedDecimal.toString()}`
          : `Expected decimal ${receivedDecimal.toString()} to be greater than or equal to ${expectedDecimal.toString()}`
      };
    },

    toBeGreaterThanDecimal(received: unknown, expected: Decimal | string | number) {
      const receivedDecimal = toDecimalOrNull(received);
      const expectedDecimal = toDecimalOrNull(expected);

      if (receivedDecimal == null || expectedDecimal == null) {
        return {
          pass: false,
          message: () => `Expected both values to be decimal-compatible but got received=${String(received)} expected=${String(expected)}`
        };
      }

      const pass = receivedDecimal.gt(expectedDecimal);
      return {
        pass,
        message: () => pass
          ? `Expected decimal ${receivedDecimal.toString()} to be less than or equal to ${expectedDecimal.toString()}`
          : `Expected decimal ${receivedDecimal.toString()} to be greater than ${expectedDecimal.toString()}`
      };
    },

    toEqualInteger(received: unknown, expected: Integer | string | number) {
      const receivedInteger = toIntegerOrNull(received);
      const expectedInteger = toIntegerOrNull(expected);

      if (receivedInteger == null || expectedInteger == null) {
        return {
          pass: false,
          message: () => `Expected both values to be integer-compatible but got received=${String(received)} expected=${String(expected)}`
        };
      }

      const pass = receivedInteger.toNumber() === expectedInteger.toNumber();
      return {
        pass,
        message: () => pass
          ? `Expected integer values not to be equal, but both were ${receivedInteger.toString()}`
          : `Expected integer ${receivedInteger.toString()} to equal ${expectedInteger.toString()}`
      };
    },

    toBeGreaterThanOrEqualInteger(received: unknown, expected: Integer | string | number) {
      const receivedInteger = toIntegerOrNull(received);
      const expectedInteger = toIntegerOrNull(expected);

      if (receivedInteger == null || expectedInteger == null) {
        return {
          pass: false,
          message: () => `Expected both values to be integer-compatible but got received=${String(received)} expected=${String(expected)}`
        };
      }

      const pass = receivedInteger.toNumber() >= expectedInteger.toNumber();
      return {
        pass,
        message: () => pass
          ? `Expected integer ${receivedInteger.toString()} to be less than ${expectedInteger.toString()}`
          : `Expected integer ${receivedInteger.toString()} to be greater than or equal to ${expectedInteger.toString()}`
      };
    }
  });
}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeSuccess(): R;
      toBeFailureWith(expectedMessage: string): R;
      toHaveErrorMessage(expectedMessage: string): R;
      toHaveFieldError(expectedMessage: string): R;
      toEqualDecimal(expected: Decimal | string | number): R;
      toBeGreaterThanOrEqualDecimal(expected: Decimal | string | number): R;
      toBeGreaterThanDecimal(expected: Decimal | string | number): R;
      toEqualInteger(expected: Integer | string | number): R;
      toBeGreaterThanOrEqualInteger(expected: Integer | string | number): R;
    }
  }
}
