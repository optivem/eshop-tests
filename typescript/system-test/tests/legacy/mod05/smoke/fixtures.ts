import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { Closer } from '@optivem/commons';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
} from '../../../../src/index.js';
import { setupResultMatchers } from '@optivem/commons';

setupResultMatchers();

export const test = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = createShopUiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = createShopApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = createErpDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = createTaxApiDriver(getExternalSystemMode());
        await use(driver);
        await Closer.close(driver);
    },
});

export { expect } from '@playwright/test';
