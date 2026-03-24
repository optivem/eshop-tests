import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Result, mapObjectDecimals, DEFAULT_DECIMAL_KEYS, mapObjectIntegers, DEFAULT_INTEGER_KEYS } from '@optivem/commons';

export type JsonHttpClientOptions = {
    /**
     * Keys to revive as Decimal in response bodies (any nesting level).
     * Defaults to DEFAULT_DECIMAL_KEYS. Pass a custom Set to override.
     */
    decimalKeys?: Set<string>;
    /**
     * Keys to revive as Integer in response bodies (any nesting level).
     * Defaults to DEFAULT_INTEGER_KEYS. Pass a custom Set to override.
     */
    integerKeys?: Set<string>;
};

/**
 * High-level HTTP client that returns Result<T, E> directly.
 * On failure, the error response body is used as E (deserialized from JSON).
 * Response bodies are passed through mapObjectDecimals and mapObjectIntegers using default or custom key sets.
 */
export class JsonHttpClient<E> {
    private readonly client: AxiosInstance;
    private readonly decimalKeys: Set<string>;
    private readonly integerKeys: Set<string>;

    constructor(baseUrl: string, options?: JsonHttpClientOptions) {
        this.client = axios.create({
            baseURL: baseUrl,
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true,
        });
        this.decimalKeys = options?.decimalKeys ?? DEFAULT_DECIMAL_KEYS;
        this.integerKeys = options?.integerKeys ?? DEFAULT_INTEGER_KEYS;
    }

    /**
     * GET. For no response body use getAsync&lt;void&gt;(path) → Result&lt;void, E&gt;.
     */
    async getAsync<T>(path: string): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doGet(path));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * POST. For no response body use postAsync&lt;void&gt;(path, request) → Result&lt;void, E&gt;.
     */
    async postAsync<T>(path: string, request: object): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doPost(path, request));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * PUT. For no response body use putAsync&lt;void&gt;(path, request) → Result&lt;void, E&gt;.
     */
    async putAsync<T>(path: string, request: object): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doPut(path, request));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * DELETE. For no response body use deleteAsync&lt;void&gt;(path) → Result&lt;void, E&gt;.
     */
    async deleteAsync<T>(path: string): Promise<Result<T, E>> {
        const httpResponse = await this.doRequest(() => this.doDelete(path));
        return this.getResultOrFailure<T>(httpResponse);
    }

    /**
     * HELPERS
     */

    private doGet(path: string): Promise<AxiosResponse<unknown>> {
        return this.client.get(path);
    }

    private doPost(path: string, request: object): Promise<AxiosResponse<unknown>> {
        return this.client.post(path, request);
    }

    private doPut(path: string, request: object): Promise<AxiosResponse<unknown>> {
        return this.client.put(path, request);
    }

    private doDelete(path: string): Promise<AxiosResponse<unknown>> {
        return this.client.delete(path);
    }

    private async doRequest(request: () => Promise<AxiosResponse<unknown>>): Promise<Result<AxiosResponse<unknown>, E>> {
        try {
            const response = await request();
            return Result.success(response);
        } catch (error) {
            return Result.failure(this.axiosErrorToError(error) as E);
        }
    }

    private getResultOrFailure<T>(httpResponse: Result<AxiosResponse<unknown>, E>): Result<T, E> {
        if (httpResponse.isFailure()) return Result.failure(httpResponse.getError());
        const response = httpResponse.getValue();
        if (response.status >= 200 && response.status < 300) {
            let data = response.data as T;
            if (data != null && typeof data === 'object') {
                data = mapObjectDecimals(data, this.decimalKeys) as T;
                data = mapObjectIntegers(data, this.integerKeys) as T;
            }
            return Result.success(data);
        }
        // Deserialize error response body to E
        const error = this.readErrorResponse(response);
        return Result.failure(error as E);
    }

    /**
     * Use response body as error E. If body is already an object (JSON), use it; otherwise wrap in { message }.
     */
    private readErrorResponse(response: AxiosResponse<unknown>): unknown {
        const data = response.data;
        if (data != null && typeof data === 'object') {
            return data;
        }
        return { message: typeof data === 'string' ? data : JSON.stringify(data) };
    }

    private axiosErrorToError(error: unknown): unknown {
        if (axios.isAxiosError(error)) {
            const ax = error as AxiosError<unknown>;
            if (ax.response?.data != null && typeof ax.response.data === 'object') {
                return ax.response.data;
            }
            return { message: ax.message };
        }
        return { message: error instanceof Error ? error.message : String(error) };
    }
}

// TODO: VJ: Please check whole file, esp from doGet, etc...
