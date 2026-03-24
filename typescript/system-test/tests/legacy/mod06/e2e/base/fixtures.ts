/**
 * V4 e2e fixtures: channel-based shop driver + external drivers (ERP/Tax).
 * Mirrors reference V4 driver-level style (no ScenarioDsl).
 */
import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { bindTestEach, forChannels as sharedForChannels } from '@optivem/optivem-testing';
import { Closer, setupResultMatchers } from '@optivem/commons';
import {
    channelShopDriverTest as sharedChannelShopDriverTest,
    createShopDriverForChannel,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
    withChannelShopDriver,
    createUniqueSku,
} from '../../../../../src/index.js';

setupResultMatchers();

const testBase = base.extend<{
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}>({
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

export interface V4ChannelFixtures {
    shopDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}

export function forChannels(...channelTypes: string[]): (block: () => void) => void {
    return sharedForChannels(
        {
            describe: (name, callback) => test.describe(name, callback),
            beforeEach: (callback) => test.beforeEach(callback),
            afterEach: (callback) => test.afterEach(callback),
        },
        ...channelTypes
    );
}

export { createUniqueSku, createShopDriverForChannel, withChannelShopDriver };

export function channelShopDriverTest(
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: V4ChannelFixtures) => Promise<void>
): void {
    sharedChannelShopDriverTest(
        (name, run) => test(name, run),
        channelTypes,
        testName,
        testFn,
        { respectChannelEnv: true }
    );
}
