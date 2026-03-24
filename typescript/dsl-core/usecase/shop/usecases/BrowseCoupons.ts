import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import type { BrowseCouponsResponse } from '../commons/dtos/index.js';
import { BrowseCouponsVerification } from './BrowseCouponsVerification.js';

export class BrowseCoupons extends BaseShopCommand<BrowseCouponsResponse, BrowseCouponsVerification> {
    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ShopUseCaseResult<BrowseCouponsResponse, BrowseCouponsVerification>> {
        const result = await this.driver.browseCoupons();
        return new ShopUseCaseResult(
            result,
            this.context,
            (response, ctx) => new BrowseCouponsVerification(response, ctx)
        );
    }
}





