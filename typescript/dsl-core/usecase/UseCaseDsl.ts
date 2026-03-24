import { UseCaseContext } from '@optivem/dsl-core/shared';
import { Closer } from '@optivem/commons';
import type { Configuration } from './Configuration.js';
import { ShopDsl } from './shop/ShopDsl.js';
import { ErpDsl } from './external/erp/ErpDsl.js';
import { TaxDsl } from './external/tax/TaxDsl.js';
import { ClockDsl } from './external/clock/ClockDsl.js';

export class UseCaseDsl {
    private readonly context: UseCaseContext;
    private readonly configuration: Configuration;

    private shopDsl?: ShopDsl;
    private erpDsl?: ErpDsl;
    private taxDsl?: TaxDsl;
    private clockDsl?: ClockDsl;

    constructor(configuration: Configuration, context: UseCaseContext);
    constructor(configuration: Configuration);
    constructor(configuration: Configuration, context?: UseCaseContext) {
        this.configuration = configuration;
        this.context =
            context !== undefined
                ? context
                : new UseCaseContext(this.configuration.getExternalSystemMode());
    }

    /**
     * Close all DSLs. Only shop is closed asynchronously (awaited); erp, tax, and clock
     * are closed synchronously (Shop async, rest sync).
     */
    async close(): Promise<void> {
        await Closer.close(this.shopDsl);
        this.closeSync(this.erpDsl as { close?: () => void | Promise<void> } | undefined);
        this.closeSync(this.taxDsl);
        this.closeSync(this.clockDsl);
    }

    private closeSync(closeable: { close?: () => void | Promise<void> } | null | undefined): void {
        if (closeable == null || typeof closeable.close !== 'function') return;
        const result = closeable.close();
        if (result instanceof Promise) {
            void result.catch(() => {});
        }
    }

    shop(): ShopDsl {
        return this.getOrCreate(
            this.shopDsl,
            () =>
                (this.shopDsl = new ShopDsl(
                    this.configuration.getShopUiBaseUrl(),
                    this.configuration.getShopApiBaseUrl(),
                    this.context
                ))
        );
    }

    erp(): ErpDsl {
        return this.getOrCreate(
            this.erpDsl,
            () => (this.erpDsl = new ErpDsl(this.configuration.getErpBaseUrl(), this.context))
        );
    }

    tax(): TaxDsl {
        return this.getOrCreate(
            this.taxDsl,
            () => (this.taxDsl = new TaxDsl(this.configuration.getTaxBaseUrl(), this.context))
        );
    }

    clock(): ClockDsl {
        return this.getOrCreate(
            this.clockDsl,
            () => (this.clockDsl = new ClockDsl(this.configuration.getClockBaseUrl(), this.context))
        );
    }

    private getOrCreate<T>(instance: T | undefined, supplier: () => T): T {
        return instance !== undefined ? instance : supplier();
    }
}


