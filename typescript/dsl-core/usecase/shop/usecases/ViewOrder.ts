import type { Optional } from '@optivem/commons';
import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import type { ViewOrderResponse } from '../commons/dtos/index.js';
import { ViewOrderVerification } from './ViewOrderVerification.js';

export class ViewOrder extends BaseShopCommand<ViewOrderResponse, ViewOrderVerification> {
    private orderNumberResultAlias: Optional<string>;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(orderNumberResultAlias: Optional<string>): ViewOrder {
        this.orderNumberResultAlias = orderNumberResultAlias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<ViewOrderResponse, ViewOrderVerification>> {
        const orderNumber = this.context.getResultValue(this.orderNumberResultAlias!);
        const result = await this.driver.viewOrder(orderNumber);
        return new ShopUseCaseResult(result, this.context, (response, ctx) => new ViewOrderVerification(response, ctx));
    }
}





