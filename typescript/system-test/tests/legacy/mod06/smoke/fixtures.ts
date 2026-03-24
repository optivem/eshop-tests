import { test as base } from '@playwright/test';
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { Closer } from '@optivem/commons';
import {
    channelShopDriverTest as sharedChannelShopDriverTest,
    createShopDriverForChannel,
    createErpDriver,
    createTaxApiDriver,
    getExternalSystemMode,
} from '../../../../src/index.js';
import { setupResultMatchers } from '@optivem/commons';

setupResultMatchers();

export const test = base.extend<{
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

export { expect } from '@playwright/test';

export interface V4ChannelFixtures {
    shopDriver: ShopDriver;
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}
export { createShopDriverForChannel };

/**
 * Run the same shop driver test for each channel (UI/API). Sets ChannelContext and creates shopDriver per channel.
 */
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
        { respectChannelEnv: false }
    );
}
