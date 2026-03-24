import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';

export class Configuration {
    constructor(
        private readonly shopUiBaseUrl: string,
        private readonly shopApiBaseUrl: string,
        private readonly erpBaseUrl: string,
        private readonly taxBaseUrl: string,
        private readonly clockBaseUrl: string,
        private readonly externalSystemMode: ExternalSystemMode
    ) {}

    getShopUiBaseUrl(): string {
        return this.shopUiBaseUrl;
    }

    getShopApiBaseUrl(): string {
        return this.shopApiBaseUrl;
    }

    getErpBaseUrl(): string {
        return this.erpBaseUrl;
    }

    getTaxBaseUrl(): string {
        return this.taxBaseUrl;
    }

    getClockBaseUrl(): string {
        return this.clockBaseUrl;
    }

    getExternalSystemMode(): ExternalSystemMode {
        return this.externalSystemMode;
    }
}

