import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import type { Optional } from '@optivem/commons';
import type { PlaceOrderRequest, PlaceOrderResponse } from '../commons/dtos/index.js';
import { systemErrorToString } from '../commons/dtos/errors/SystemError.js';
import { PlaceOrderVerification } from './PlaceOrderVerification.js';

export class PlaceOrder extends BaseShopCommand<PlaceOrderResponse, PlaceOrderVerification> {
    private orderNumberResultAlias: Optional<string>;
    private skuParamAlias: Optional<string>;
    private quantityValue: Optional<string>;
    private countryAlias: Optional<string>;
    private couponCodeAlias: Optional<string>;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    orderNumber(orderNumberResultAlias: Optional<string>): PlaceOrder {
        this.orderNumberResultAlias = orderNumberResultAlias;
        return this;
    }

    sku(skuParamAlias: Optional<string>): PlaceOrder {
        this.skuParamAlias = skuParamAlias;
        return this;
    }

    quantity(value: Optional<string | number>): PlaceOrder {
        this.quantityValue = value === undefined || value === null ? undefined : typeof value === 'number' ? String(value) : value;
        return this;
    }

    country(countryAlias: Optional<string>): PlaceOrder {
        this.countryAlias = countryAlias;
        return this;
    }

    couponCode(couponCodeAlias: Optional<string>): PlaceOrder {
        this.couponCodeAlias = couponCodeAlias;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<PlaceOrderResponse, PlaceOrderVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias);
        const country = this.context.getParamValueOrLiteral(this.countryAlias);
        const couponCode = this.context.getParamValue(this.couponCodeAlias);

        const request: PlaceOrderRequest = { sku, quantity: this.quantityValue, country, couponCode };
        
        const result = await this.driver.placeOrder(request);
        
        if (this.orderNumberResultAlias != null) {
            if (result.isSuccess()) {
                this.context.setResultEntry(this.orderNumberResultAlias, result.getValue().orderNumber);
            } else {
                this.context.setResultEntryFailed(this.orderNumberResultAlias, systemErrorToString(result.getError()));
            }
        }
        return new ShopUseCaseResult(result, this.context, (response, ctx) => new PlaceOrderVerification(response, ctx));
    }
}





