import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { ChannelContext } from '@optivem/optivem-testing';
import { Closer } from '@optivem/commons';
import {
    createShopUiDriver,
    createShopApiDriver,
    createErpDriver,
    createTaxApiDriver,
} from './createDrivers.js';
import { getExternalSystemMode } from '../configuration/index.js';

export interface ExternalDriversFixtures {
    erpDriver: ReturnType<typeof createErpDriver>;
    taxDriver: ReturnType<typeof createTaxApiDriver>;
}

export interface V4ChannelFixtures extends ExternalDriversFixtures {
    shopDriver: ShopDriver;
}

export function createShopDriverForChannel(channel: string): ShopDriver {
    const externalSystemMode = getExternalSystemMode(undefined);
    return channel === ChannelType.UI
        ? createShopUiDriver(externalSystemMode)
        : createShopApiDriver(externalSystemMode);
}

export async function withChannelShopDriver<T>(
    testFn: (shopDriver: ShopDriver) => Promise<T>,
    channel?: string
): Promise<T> {
    const resolvedChannel = channel ?? ChannelContext.get();
    if (resolvedChannel == null || resolvedChannel === '') {
        throw new Error('Channel is not set. Use forChannels(...) or pass channel explicitly to withChannelShopDriver.');
    }

    const manageContext = channel != null && channel !== '';
    const shopDriver = createShopDriverForChannel(resolvedChannel);
    try {
        if (manageContext) {
            ChannelContext.set(resolvedChannel);
        }
        return await testFn(shopDriver);
    } finally {
        await Closer.close(shopDriver);
        if (manageContext) {
            ChannelContext.clear();
        }
    }
}

export function channelShopDriverTest(
    registerTest: (testName: string, testFn: (fixtures: ExternalDriversFixtures) => Promise<void>) => void,
    channelTypes: string[],
    testName: string,
    testFn: (fixtures: V4ChannelFixtures) => Promise<void>,
    options?: { respectChannelEnv?: boolean }
): void {
    const channelEnv = process.env.CHANNEL;
    const shouldFilterByEnv = options?.respectChannelEnv ?? true;
    const channelsToRun = shouldFilterByEnv && channelEnv != null && channelEnv !== ''
        ? channelTypes.filter((c) => c === channelEnv)
        : channelTypes;

    for (const channel of channelsToRun) {
        registerTest(`[${channel} Channel] ${testName}`, async ({ erpDriver, taxDriver }) => {
            try {
                ChannelContext.set(channel);
                const shopDriver = createShopDriverForChannel(channel);
                try {
                    await testFn({ shopDriver, erpDriver, taxDriver });
                } finally {
                    await Closer.close(shopDriver);
                }
            } finally {
                ChannelContext.clear();
            }
        });
    }
}