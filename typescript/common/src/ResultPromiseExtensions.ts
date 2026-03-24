import { Result } from './Result.js';

/**
 * Result task extensions.
 * Provides mapAsync, mapErrorAsync, and mapVoidAsync over Promise<Result<T, E>>.
 */

export function mapErrorAsync<T, E, E2>(
    resultPromise: Promise<Result<T, E>>,
    mapper: (error: E) => E2
): Promise<Result<T, E2>> {
    return resultPromise.then((result) => result.mapError(mapper));
}

export function mapAsync<T, T2, E>(
    resultPromise: Promise<Result<T, E>>,
    mapper: (value: T) => T2
): Promise<Result<T2, E>> {
    return resultPromise.then((result) => result.map(mapper));
}

export function mapVoidAsync<T, E>(
    resultPromise: Promise<Result<T, E>>
): Promise<Result<void, E>> {
    return resultPromise.then((result) => result.mapVoid());
}

/**
 * Wraps Promise<Result<T, E>> for fluent .NET-style chaining.
 * Use forResultPromise(client.getTime()).mapAsync(...).mapErrorAsync(...) then await or .then().
 */
export class ResultPromise<T, E> implements PromiseLike<Result<T, E>> {
    constructor(private readonly promise: Promise<Result<T, E>>) {}

    mapAsync<T2>(mapper: (value: T) => T2): ResultPromise<T2, E> {
        return new ResultPromise(this.promise.then((r) => r.map(mapper)));
    }

    mapErrorAsync<E2>(mapper: (error: E) => E2): ResultPromise<T, E2> {
        return new ResultPromise(this.promise.then((r) => r.mapError(mapper)));
    }

    mapVoidAsync(): ResultPromise<void, E> {
        return new ResultPromise(this.promise.then((r) => r.mapVoid()));
    }

    then<TResult1 = Result<T, E>, TResult2 = never>(
        onfulfilled?: (value: Result<T, E>) => TResult1 | PromiseLike<TResult1>,
        onrejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }
}

export function forResultPromise<T, E>(promise: Promise<Result<T, E>>): ResultPromise<T, E> {
    return new ResultPromise(promise);
}
