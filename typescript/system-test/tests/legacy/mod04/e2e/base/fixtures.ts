import { test as base } from '@playwright/test';
import { ShopUiClient } from '@optivem/driver-adapter/shop/ui/client/ShopUiClient.js';
import { ShopApiClient } from '@optivem/driver-adapter/shop/api/client/ShopApiClient.js';
import { ErpRealClient } from '@optivem/driver-adapter/external/erp/client/ErpRealClient.js';
import { TaxRealClient } from '@optivem/driver-adapter/external/tax/client/TaxRealClient.js';
import { Closer, setupResultMatchers } from '@optivem/commons';
import { bindTestEach } from '@optivem/optivem-testing';
import { testConfig, createUniqueSku } from '../../../../../src/index.js';

setupResultMatchers();

type V2Fixtures = {
    shopUiClient: ShopUiClient;
    shopApiClient: ShopApiClient;
    erpClient: ErpRealClient;
    taxClient: TaxRealClient;
};

const testBase = base.extend<{
    shopUiClient: ShopUiClient;
    shopApiClient: ShopApiClient;
    erpClient: ErpRealClient;
    taxClient: TaxRealClient;
}>({
    shopUiClient: async ({}, use) => {
        const client = new ShopUiClient(testConfig.urls.shopUi);
        await use(client);
        await client.close();
    },
    shopApiClient: async ({}, use) => {
        const client = new ShopApiClient(testConfig.urls.shopApi);
        await use(client);
        client.close();
    },
    erpClient: async ({}, use) => {
        const client = new ErpRealClient(testConfig.urls.erpApi);
        await use(client);
        await Closer.close(client);
    },
    taxClient: async ({}, use) => {
        const client = new TaxRealClient(testConfig.urls.taxApi);
        await use(client);
        await Closer.close(client);
    },
});

type TestEach = ReturnType<typeof bindTestEach>;
export const test: typeof testBase & { each: TestEach } = Object.assign(testBase, { each: bindTestEach(testBase) });

export { expect } from '@playwright/test';

export { createUniqueSku };
