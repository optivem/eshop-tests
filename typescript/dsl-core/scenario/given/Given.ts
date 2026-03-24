import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import type { ThenGivenStagePort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import { WhenClause } from '../when/When.js';
import { ThenGivenStage } from '../then/ThenGivenStage.js';
import { GivenProductBuilder } from './GivenProduct.js';
import { GivenOrderBuilder } from './GivenOrder.js';
import { GivenClockBuilder } from './GivenClock.js';
import { GivenCountryBuilder } from './GivenCountry.js';
import { GivenCouponBuilder } from './GivenCoupon.js';

/**
 * Given clause for Gherkin scenarios (app, products, orders, clock, countries, coupons).
 */
export class GivenClause {
    private readonly app: UseCaseDsl;
    private readonly products: GivenProductBuilder[];
    private readonly orders: GivenOrderBuilder[];
    private clockBuilder: GivenClockBuilder | null;
    private readonly countries: GivenCountryBuilder[];
    private readonly coupons: GivenCouponBuilder[];

    constructor(app: UseCaseDsl) {
        this.app = app;
        this.products = [];
        this.orders = [];
        this.clockBuilder = null;
        this.countries = [];
        this.coupons = [];
    }

    product(): GivenProductBuilder {
        const productBuilder = new GivenProductBuilder(this);
        this.products.push(productBuilder);
        return productBuilder;
    }

    order(): GivenOrderBuilder {
        const orderBuilder = new GivenOrderBuilder(this);
        this.orders.push(orderBuilder);
        return orderBuilder;
    }

    clock(): GivenClockBuilder {
        this.clockBuilder = new GivenClockBuilder(this);
        return this.clockBuilder;
    }

    country(): GivenCountryBuilder {
        const taxRateBuilder = new GivenCountryBuilder(this);
        this.countries.push(taxRateBuilder);
        return taxRateBuilder;
    }

    coupon(): GivenCouponBuilder {
        const couponBuilder = new GivenCouponBuilder(this);
        this.coupons.push(couponBuilder);
        return couponBuilder;
    }

    when(): WhenClause {
        return new WhenClause(
            this.app,
            this.products.length > 0,
            this.countries.length > 0,
            () => this.setupGiven()
        );
    }

    then(): ThenGivenStagePort {
        return new ThenGivenStage(this.app, () => this.setupGiven());
    }

    and(): GivenClause {
        return this;
    }

    private async setupGiven(): Promise<void> {
        await this.setupClock();
        await this.setupErp();
        await this.setupTax();
        await this.setupShop();
    }

    private async setupClock(): Promise<void> {
        if (this.clockBuilder !== null) {
            await this.clockBuilder.execute(this.app);
        }
    }

    private async setupErp(): Promise<void> {
        if (this.orders.length > 0 && this.products.length === 0) {
            const defaultProduct = new GivenProductBuilder(this);
            this.products.push(defaultProduct);
        }
        for (const product of this.products) {
            await product.execute(this.app);
        }
    }

    private async setupTax(): Promise<void> {
        if (this.orders.length > 0 && this.countries.length === 0) {
            const defaultCountry = new GivenCountryBuilder(this);
            this.countries.push(defaultCountry);
        }
        for (const country of this.countries) {
            await country.execute(this.app);
        }
    }

    private async setupShop(): Promise<void> {
        await this.setupCoupons();
        await this.setupOrders();
    }

    private async setupCoupons(): Promise<void> {
        if (this.orders.length > 0 && this.coupons.length === 0) {
            const defaultCoupon = new GivenCouponBuilder(this);
            this.coupons.push(defaultCoupon);
        }
        for (const coupon of this.coupons) {
            await coupon.execute(this.app);
        }
    }

    private async setupOrders(): Promise<void> {
        for (const order of this.orders) {
            await order.execute(this.app);
        }
    }
}
