import { UseCaseContext } from '@optivem/dsl-core/shared';
import { Closer } from '@optivem/commons';
import { ChannelContext } from '@optivem/optivem-testing';
import { ChannelType } from './ChannelType.js';
import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { ShopApiDriver } from '@optivem/driver-adapter/shop/api/ShopApiDriver.js';
import { ShopUiDriver } from '@optivem/driver-adapter/shop/ui/ShopUiDriver.js';
import { GoToShop } from './usecases/GoToShop.js';
import { PlaceOrder } from './usecases/PlaceOrder.js';
import { CancelOrder } from './usecases/CancelOrder.js';
import { ViewOrder } from './usecases/ViewOrder.js';
import { PublishCoupon } from './usecases/PublishCoupon.js';
import { BrowseCoupons } from './usecases/BrowseCoupons.js';

export class ShopDsl {
    private readonly driver: ShopDriver;
    private readonly context: UseCaseContext;

    constructor(uiBaseUrl: string, apiBaseUrl: string, context: UseCaseContext) {
        this.driver = this.createDriver(uiBaseUrl, apiBaseUrl);
        this.context = context;
    }

    private createDriver(uiBaseUrl: string, apiBaseUrl: string): ShopDriver {
        const channel = ChannelContext.get();
        if (channel === ChannelType.UI) {
            return new ShopUiDriver(uiBaseUrl);
        } else if (channel === ChannelType.API) {
            return new ShopApiDriver(apiBaseUrl);
        } else {
            throw new Error(`Unknown channel: ${channel}`);
        }
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToShop(): GoToShop {
        return new GoToShop(this.driver, this.context);
    }

    placeOrder(): PlaceOrder {
        return new PlaceOrder(this.driver, this.context);
    }

    cancelOrder(): CancelOrder {
        return new CancelOrder(this.driver, this.context);
    }

    viewOrder(): ViewOrder {
        return new ViewOrder(this.driver, this.context);
    }

    publishCoupon(): PublishCoupon {
        return new PublishCoupon(this.driver, this.context);
    }

    browseCoupons(): BrowseCoupons {
        return new BrowseCoupons(this.driver, this.context);
    }
}





