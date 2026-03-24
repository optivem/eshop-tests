import type { Result } from '@optivem/commons';
import type { ShopDriver } from '../ShopDriver.js';
import type { SystemError } from '../commons/dtos/errors/SystemError.js';
import { ShopApiClient } from './client/ShopApiClient.js';
import { systemErrorFrom } from '../commons/dtos/errors/SystemError.js';
import type { Optional } from '@optivem/commons';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../commons/dtos/index.js';
import type { PublishCouponRequest, BrowseCouponsResponse } from '../commons/dtos/index.js';

export class ShopApiDriver implements ShopDriver {
    private readonly apiClient: ShopApiClient;

    constructor(baseUrl: string) {
        this.apiClient = new ShopApiClient(baseUrl);
    }
    
    async close(): Promise<void> {
        this.apiClient.close();
    }

    goToShop(): Promise<Result<void, SystemError>> {
        return this.apiClient.health().checkHealth().then((r) => r.mapError((e) => systemErrorFrom(e)));
    }

    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>> {
        return this.apiClient.orders()
            .placeOrder(request)
            .then((result) => result.mapError((error) => systemErrorFrom(error)));
    }

    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>> {
        return this.apiClient.orders()
            .cancelOrder(orderNumber)
            .then((result) => result.mapError((error) => systemErrorFrom(error)));
    }

    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>> {
        return this.apiClient
            .orders()
            .viewOrder(orderNumber)
            .then((result) => result.mapError((error) => systemErrorFrom(error)));
    }

    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>> {
        return this.apiClient.coupons()
            .publishCoupon(request)
            .then((result) => result.mapError((error) => systemErrorFrom(error)));
    }

    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>> {
        return this.apiClient
            .coupons()
            .browseCoupons()
            .then((result) => result.mapError((error) => systemErrorFrom(error)));
    }
}

