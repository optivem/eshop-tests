/**
 * V3 shop smoke: abstract base with shared test logic.
 * Subclasses provide the driver via getDriver().
 */
import type { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { expect } from '@playwright/test';

export abstract class ShopBaseSmokeTest {
    protected abstract getDriver(): ShopDriver;

    async shouldBeAbleToGoToShop(): Promise<void> {
        const result = await this.getDriver().goToShop();
        expect(result).toBeSuccess();
    }
}

export class ShopApiSmokeTest extends ShopBaseSmokeTest {
    constructor(private readonly driver: ShopDriver) {
        super();
    }
    protected getDriver(): ShopDriver {
        return this.driver;
    }
}

export class ShopUiSmokeTest extends ShopBaseSmokeTest {
    constructor(private readonly driver: ShopDriver) {
        super();
    }
    protected getDriver(): ShopDriver {
        return this.driver;
    }
}
