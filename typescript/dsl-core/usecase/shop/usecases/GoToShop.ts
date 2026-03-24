import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import { VoidVerification } from '@optivem/dsl-core/shared';

export class GoToShop extends BaseShopCommand<void, VoidVerification> {
    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const result = await this.driver.goToShop();
        return new ShopUseCaseResult(result, this.context, (_r, ctx) => new VoidVerification(undefined, ctx));
    }
}


