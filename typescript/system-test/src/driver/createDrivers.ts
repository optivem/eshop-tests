import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { ShopUiDriver } from '@optivem/driver-adapter/shop/ui/ShopUiDriver.js';
import { ShopApiDriver } from '@optivem/driver-adapter/shop/api/ShopApiDriver.js';
import { ErpRealDriver } from '@optivem/driver-adapter/external/erp/ErpRealDriver.js';
import type { TaxDriver } from '@optivem/driver-port/external/tax/TaxDriver.js';
import { TaxRealDriver } from '@optivem/driver-adapter/external/tax/TaxRealDriver.js';
import { getConfiguration } from './configurationLoaderRegistry.js';

export function createShopUiDriver(externalSystemMode?: ExternalSystemMode): ShopUiDriver {
    const config = getConfiguration(externalSystemMode);
    return new ShopUiDriver(config.shopUiBaseUrl);
}

export function createShopApiDriver(externalSystemMode?: ExternalSystemMode): ShopApiDriver {
    const config = getConfiguration(externalSystemMode);
    return new ShopApiDriver(config.shopApiBaseUrl);
}

export function createErpDriver(externalSystemMode?: ExternalSystemMode): ErpRealDriver {
    const config = getConfiguration(externalSystemMode);
    return new ErpRealDriver(config.erpBaseUrl);
}

export function createTaxApiDriver(externalSystemMode?: ExternalSystemMode): TaxDriver {
    const config = getConfiguration(externalSystemMode);
    return new TaxRealDriver(config.taxBaseUrl);
}
