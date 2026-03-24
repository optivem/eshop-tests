import { Result } from '@optivem/commons';
import { systemErrorOf, type SystemError } from './dtos/errors/SystemError.js';

export function success<T>(value: T): Result<T, SystemError> {
    return Result.success(value);
}

export function successVoid(): Result<void, SystemError> {
    return Result.success();
}

export function failure<T>(message: string): Result<T, SystemError> {
    return Result.failure(systemErrorOf(message));
}

export function failureWithError<T>(error: SystemError): Result<T, SystemError> {
    return Result.failure(error);
}
