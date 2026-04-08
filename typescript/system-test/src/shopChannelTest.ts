import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import {
    createShopApiDriver,
    createShopUiDriver,
    createErpDriver,
    createTaxApiDriver
} from './driver/createDrivers.js';
import { getDefaultExternalSystemMode } from './driver/configurationLoaderRegistry.js';
import type { ChannelTypeValue } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { channelTest, resolveAlsoChannels } from '@optivem/optivem-testing';

export { channelTest };

export interface ShopFixtures {
    shopDriver: unknown;
    erpApiDriver: unknown;
    taxApiDriver: unknown;
}

function shopDriverFactory(externalSystemMode: ExternalSystemMode): (channelType: string) => unknown {
    const factories: Record<ChannelTypeValue, () => unknown> = {
        [ChannelType.API]: () => createShopApiDriver(externalSystemMode),
        [ChannelType.UI]: () => createShopUiDriver(externalSystemMode)
    };
    return (channelType: string) => factories[channelType as ChannelTypeValue]();
}

function formatTestData(data: unknown): string {
    const entries = Object.entries(data as object)
        .filter(([key]) => !key.startsWith('expected'))
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    return `[${entries.join(', ')}]`;
}

export function shopChannelTest(
    externalSystemMode: ExternalSystemMode,
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: ShopFixtures) => Promise<void>
): void;

export function shopChannelTest<T>(
    externalSystemMode: ExternalSystemMode,
    channelTypes: string[],
    testData: T[],
    testNameFn: (data: T) => string,
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
): void;

export function shopChannelTest<T>(
    externalSystemMode: ExternalSystemMode,
    channelTypes: string[],
    testData: T[],
    testName: string,
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
): void;

export function shopChannelTest<T = never>(
    externalSystemMode: ExternalSystemMode,
    channelTypes: string[],
    testNameOrData: string | T[],
    testNameFnOrTestFn: string | ((data: T) => string) | ((fixtures: ShopFixtures) => Promise<void>),
    testFn?: (fixtures: ShopFixtures, data: T) => Promise<void>
): void {
    const additionalFixtures = {
        erpApiDriver: () => createErpDriver(externalSystemMode),
        taxApiDriver: () => createTaxApiDriver(externalSystemMode)
    };
    const createShopDriver = shopDriverFactory(externalSystemMode);

    if (typeof testNameOrData === 'string') {
        const testName = testNameOrData;
        const fn = testNameFnOrTestFn as (fixtures: ShopFixtures) => Promise<void>;
        channelTest(channelTypes, createShopDriver, 'shopDriver', additionalFixtures, testName, fn);
    } else {
        const testDataArray = testNameOrData as T[];
        const baseTestName = testNameFnOrTestFn as string | ((data: T) => string);
        const fn = testFn!;

        testDataArray.forEach((testData) => {
            const testName =
                typeof baseTestName === 'function'
                    ? baseTestName(testData)
                    : `${baseTestName} ${formatTestData(testData)}`;

            const effectiveChannels = resolveAlsoChannels(channelTypes, testData);

            channelTest(effectiveChannels, createShopDriver, 'shopDriver', additionalFixtures, testName, async ({ shopDriver, erpApiDriver, taxApiDriver }) => {
                return fn({ shopDriver, erpApiDriver, taxApiDriver }, testData);
            });
        });
    }
}

export function shopChannelTestEach<T>(
    channelTypes: string[],
    testName: string,
    testData: T[],
    testFn: (fixtures: ShopFixtures, data: T) => Promise<void>
): void {
    testData.forEach((data) => {
        const formattedName = testName.replace('%s', JSON.stringify(data));
        shopChannelTest(getDefaultExternalSystemMode(), channelTypes, formattedName, async (fixtures) => {
            await testFn(fixtures, data);
        });
    });
}

