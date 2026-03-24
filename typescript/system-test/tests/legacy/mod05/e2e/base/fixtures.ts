/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { Closer, setupResultMatchers } from '@optivem/commons';
import { bindTestEach } from '@optivem/optivem-testing';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
    createUniqueSku,
} from '../../../../../src/index.js';

setupResultMatchers();

type V3Fixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
};

const testBase = base.extend<{
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

type TestEach = ReturnType<typeof bindTestEach>;
export const test: typeof testBase & { each: TestEach } = Object.assign(testBase, { each: bindTestEach(testBase) });

export { expect } from '@playwright/test';

export { createUniqueSku };
