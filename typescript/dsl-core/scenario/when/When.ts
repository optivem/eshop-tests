import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { GoToShopBuilder } from './WhenGoToShop.js';
import { PlaceOrderBuilder } from './WhenPlaceOrder.js';
import { CancelOrderBuilder } from './WhenCancelOrder.js';
import { ViewOrderBuilder } from './WhenViewOrder.js';
import { PublishCouponBuilder } from './WhenPublishCoupon.js';
import { BrowseCouponsBuilder } from './WhenBrowseCoupons.js';

export class WhenClause {
    constructor(
        private readonly app: UseCaseDsl,
        private hasProduct: boolean = false,
        private hasTaxRate: boolean = false,
        private readonly givenSetup?: () => Promise<void>
    ) {}

    private async ensureGiven(): Promise<void> {
        if (this.givenSetup) {
            await this.givenSetup();
        }

        if (!this.hasProduct) {
            try {
                await this.app
                    .erp()
                    .returnsProduct()
                    .sku(GherkinDefaults.DEFAULT_SKU)
                    .unitPrice(GherkinDefaults.DEFAULT_UNIT_PRICE)
                    .execute()
                    .then((r) => r.shouldSucceed());
            } catch (e) {
                // Ignore "already exists" errors (duplicate id from re-entrant calls)
                if (!String(e).includes('duplicate') && !String(e).includes('Insert failed')) throw e;
            }
            this.hasProduct = true;
        }
        if (!this.hasTaxRate) {
            try {
                await this.app
                    .tax()
                    .returnsTaxRate()
                    .country(GherkinDefaults.DEFAULT_COUNTRY)
                    .taxRate(GherkinDefaults.DEFAULT_TAX_RATE)
                    .execute()
                    .then((r) => r.shouldSucceed());
            } catch (e) {
                if (!String(e).includes('duplicate') && !String(e).includes('Insert failed')) throw e;
            }
            this.hasTaxRate = true;
        }
    }

    goToShop(): GoToShopBuilder {
        return new GoToShopBuilder(this.app);
    }

    placeOrder(): PlaceOrderBuilder {
        return new PlaceOrderBuilder(this.app, () => this.ensureGiven());
    }

    cancelOrder(): CancelOrderBuilder {
        return new CancelOrderBuilder(this.app, () => this.ensureGiven());
    }

    viewOrder(): ViewOrderBuilder {
        return new ViewOrderBuilder(this.app, () => this.ensureGiven());
    }

    publishCoupon(): PublishCouponBuilder {
        return new PublishCouponBuilder(this.app, this.givenSetup);
    }

    browseCoupons(): BrowseCouponsBuilder {
        return new BrowseCouponsBuilder(this.app);
    }
}
