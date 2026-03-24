/**
 * V1 e2e fixtures: raw-driver style (Shop/ERP/Tax), no ScenarioDsl.
 * Parity with Java/.NET v1 BaseE2eTest: fixed REAL external system mode.
 */
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { Closer, setupResultMatchers } from '@optivem/commons';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
    createUniqueSku,
} from '../../../../../src/index.js';

const FIXED_EXTERNAL_SYSTEM_MODE = 'REAL';

type V1Fixtures = {
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
};

setupResultMatchers();

const testBase = base.extend<{
    shopUiDriver: ShopDriver;
    shopApiDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
    shopUiDriver: async ({}, use) => {
        const driver = createShopUiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    shopApiDriver: async ({}, use) => {
        const driver = createShopApiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    erpDriver: async ({}, use) => {
        const driver = createErpDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
    taxDriver: async ({}, use) => {
        const driver = createTaxApiDriver(FIXED_EXTERNAL_SYSTEM_MODE);
        await use(driver);
        await Closer.close(driver);
    },
});

const testEach = <TCase extends Record<string, unknown>>(
    cases: ReadonlyArray<TCase>
): ((name: string, fn: (args: V1Fixtures & TCase) => Promise<void>) => void) => {
    return (name: string, fn: (args: V1Fixtures & TCase) => Promise<void>): void => {
        cases.forEach((row) => {
            const testName = name.replaceAll(/\$(\w+)/g, (_, key) => {
                const value = row[key as keyof TCase];
                if (typeof value === 'string') return value;
                if (typeof value === 'number') return value.toString();
                return '';
            });

            testBase(testName, async ({ shopUiDriver, shopApiDriver, erpDriver, taxDriver }) => {
                await fn({ shopUiDriver, shopApiDriver, erpDriver, taxDriver, ...row });
            });
        });
    };
};

export const test = testBase as typeof testBase & { each: typeof testEach };
test.each = testEach;

export { expect } from '@playwright/test';

export { createUniqueSku };
