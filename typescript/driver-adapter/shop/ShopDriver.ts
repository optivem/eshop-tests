import type { Result } from '@optivem/commons';
import type { AsyncCloseable } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { SystemError } from '@optivem/driver-port/shop/dtos/errors/SystemError.js';
import type { PlaceOrderRequest } from '@optivem/driver-port/shop/dtos/PlaceOrderRequest.js';
import type { PlaceOrderResponse } from '@optivem/driver-port/shop/dtos/PlaceOrderResponse.js';
import type { ViewOrderResponse } from '@optivem/driver-port/shop/dtos/ViewOrderResponse.js';
import type { PublishCouponRequest } from '@optivem/driver-port/shop/dtos/PublishCouponRequest.js';
import type { BrowseCouponsResponse } from '@optivem/driver-port/shop/dtos/BrowseCouponsResponse.js';

export interface ShopDriver extends AsyncCloseable {
    goToShop(): Promise<Result<void, SystemError>>;
    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>>;
    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>>;
    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>>;
    publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>>;
    browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>>;
}

