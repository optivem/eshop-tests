import { Result } from '@optivem/commons';
import type { Optional } from '@optivem/commons';

const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

/**
 * WireMock admin API client. Registers stubs via POST to __admin/mappings.
 */
export class JsonWireMockClient {
    private readonly adminBaseUrl: string;

    constructor(baseUrl: string) {
        const u = new URL(baseUrl);
        this.adminBaseUrl = `${u.protocol}//${u.host}`;
    }

    async stubGet<T>(path: string, statusCode: number, response: T): Promise<Result<void, string>> {
        return this.registerStub('GET', path, statusCode, this.serialize(response));
    }

    async stubGetNoBody(path: string, statusCode: number): Promise<Result<void, string>> {
        return this.registerStub('GET', path, statusCode, null);
    }

    async stubPost<T>(path: string, statusCode: number, response: T): Promise<Result<void, string>> {
        return this.registerStub('POST', path, statusCode, this.serialize(response));
    }

    async stubPostNoBody(path: string, statusCode: number): Promise<Result<void, string>> {
        return this.registerStub('POST', path, statusCode, null);
    }

    async stubPut<T>(path: string, statusCode: number, response: T): Promise<Result<void, string>> {
        return this.registerStub('PUT', path, statusCode, this.serialize(response));
    }

    async stubPutNoBody(path: string, statusCode: number): Promise<Result<void, string>> {
        return this.registerStub('PUT', path, statusCode, null);
    }

    async stubDelete<T>(path: string, statusCode: number, response: T): Promise<Result<void, string>> {
        return this.registerStub('DELETE', path, statusCode, this.serialize(response));
    }

    async stubDeleteNoBody(path: string, statusCode: number): Promise<Result<void, string>> {
        return this.registerStub('DELETE', path, statusCode, null);
    }

    private async registerStub(
        method: string,
        path: string,
        statusCode: number,
        responseBody: Optional<string>
    ): Promise<Result<void, string>> {
        const url = `${this.adminBaseUrl}/__admin/mappings`;
        const body = JSON.stringify({
            request: { method, urlPath: path },
            response: {
                status: statusCode,
                headers: { [CONTENT_TYPE]: APPLICATION_JSON },
                ...(responseBody != null && { body: responseBody }),
            },
        });
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { [CONTENT_TYPE]: APPLICATION_JSON },
                body,
            });
            if (res.ok) {
                return Result.success();
            }
            const text = await res.text();
            return Result.failure(`Failed to register stub for ${method} ${path}: ${text}`);
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            return Result.failure(`Failed to configure ${method} stub for ${path}: ${msg}`);
        }
    }

    private serialize<T>(obj: T): string {
        return JSON.stringify(obj);
    }
}
