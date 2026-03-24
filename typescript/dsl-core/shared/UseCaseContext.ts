import { v4 as uuidv4 } from 'uuid';
import type { Optional } from '@optivem/commons';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';

export class UseCaseContext {
    private readonly externalSystemMode: ExternalSystemMode;
    private readonly paramMap: Map<string, string>;
    private readonly resultMap: Map<string, string>;

    constructor(externalSystemMode: ExternalSystemMode) {
        this.externalSystemMode = externalSystemMode;
        this.paramMap = new Map<string, string>();
        this.resultMap = new Map<string, string>();
    }

    getExternalSystemMode(): ExternalSystemMode {
        return this.externalSystemMode;
    }

    getParamValue(alias: Optional<string>): Optional<string> {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }

        const key = alias as string;
        if (this.paramMap.has(key)) {
            return this.paramMap.get(key)!;
        }

        const value = this.generateParamValue(key);
        this.paramMap.set(key, value);

        return value;
    }

    getParamValueOrLiteral(alias: Optional<string>): Optional<string> {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }
        switch (this.externalSystemMode) {
            case ExternalSystemMode.STUB:
                return this.getParamValue(alias) as string;
            case ExternalSystemMode.REAL:
                return alias;
            default:
                throw new Error(`Unsupported external system mode: ${this.externalSystemMode}`);
        }
    }

    setResultEntry(alias: Optional<string>, value: string): void {
        this.ensureAliasNotNullBlank(alias);
        const key = alias as string;
        this.resultMap.set(key, value);
    }

    setResultEntryFailed(alias: Optional<string>, errorMessage: string): void {
        this.ensureAliasNotNullBlank(alias);
        this.setResultEntry(alias, `FAILED: ${errorMessage}`);
    }

    getResultValue(alias: Optional<string>): Optional<string> {
        if (this.isNullOrBlank(alias)) {
            return alias;
        }
        const key = alias as string;
        const value = this.resultMap.get(key);
        if (value === undefined) {
            return alias;
        }
        if (value.includes('FAILED')) {
            throw new Error(`Cannot get result value for alias '${key}' because the operation failed: ${value}`);
        }
        return value;
    }

    expandAliases(message: string): string {
        let expandedMessage = this.expandAlias(message, this.paramMap);
        expandedMessage = this.expandAlias(expandedMessage, this.resultMap);
        return expandedMessage;
    }

    private expandAlias(message: string, map: Map<string, string>): string {
        let expandedMessage = message;
        for (const [alias, actualValue] of map.entries()) {
            expandedMessage = expandedMessage.replace(alias, actualValue);
        }
        return expandedMessage;
    }

    private generateParamValue(alias: Optional<string>): string {
        this.ensureAliasNotNullBlank(alias);
        const key = alias as string;
        const suffix = uuidv4().substring(0, 8);
        return `${key}-${suffix}`;
    }

    private ensureAliasNotNullBlank(alias: Optional<string>): void {
        if (this.isNullOrBlank(alias)) {
            throw new Error('Alias cannot be null or blank');
        }
    }

    private isNullOrBlank(alias: Optional<string>): boolean {
        return alias === undefined || alias === null || alias.trim().length === 0;
    }
}
