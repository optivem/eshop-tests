export class Result<T, E> {
    private constructor(
        private readonly _success: boolean,
        private readonly _value?: T,
        private readonly _error?: E
    ) {}

    static success<T, E>(value?: T): Result<T, E> {
        return new Result<T, E>(true, value, undefined);
    }

    static failure<T, E>(error: E): Result<T, E> {
        return new Result<T, E>(false, undefined, error);
    }

    isSuccess(): boolean {
        return this._success;
    }

    isFailure(): boolean {
        return !this._success;
    }

    getValue(): T {
        if (!this._success) {
            throw new Error("Cannot get value from a failed result");
        }
        return this._value!;
    }

    getError(): E {
        if (this._success) {
            throw new Error("Cannot get error from a successful result");
        }
        return this._error!;
    }

    map<T2>(mapper: (value: T) => T2): Result<T2, E> {
        if (this._success) {
            return Result.success<T2, E>(mapper(this._value!));
        }
        return Result.failure<T2, E>(this._error!);
    }

    mapError<E2>(mapper: (error: E) => E2): Result<T, E2> {
        if (this._success) {
            return Result.success<T, E2>(this._value);
        }
        return Result.failure<T, E2>(mapper(this._error!));
    }

    mapVoid(): Result<void, E> {
        if (this._success) {
            return Result.success<void, E>(undefined);
        }
        return Result.failure<void, E>(this._error!);
    }
}
