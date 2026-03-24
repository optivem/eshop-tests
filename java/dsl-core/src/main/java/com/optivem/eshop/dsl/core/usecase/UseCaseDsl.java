package com.optivem.eshop.dsl.core.usecase;

import com.optivem.eshop.dsl.driver.port.external.clock.ClockDriver;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;
import com.optivem.eshop.dsl.core.usecase.external.clock.ClockDsl;
import com.optivem.eshop.dsl.driver.port.external.erp.ErpDriver;
import com.optivem.eshop.dsl.core.usecase.external.erp.ErpDsl;
import com.optivem.eshop.dsl.driver.port.shop.ShopDriver;
import com.optivem.eshop.dsl.core.usecase.shop.ShopDsl;
import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.core.usecase.external.tax.TaxDsl;
import com.optivem.eshop.dsl.common.Closer;

import java.io.Closeable;
import java.util.function.Supplier;

public class UseCaseDsl implements Closeable {
    private final UseCaseContext context;
    private final Supplier<ShopDriver> shopDriverSupplier;
    private final Supplier<ErpDriver> erpDriverSupplier;
    private final Supplier<TaxDriver> taxDriverSupplier;
    private final Supplier<ClockDriver> clockDriverSupplier;

    private ShopDriver shopDriver;
    private ErpDriver erpDriver;
    private TaxDriver taxDriver;
    private ClockDriver clockDriver;

    private ShopDsl shop;
    private ErpDsl erp;
    private TaxDsl tax;
    private ClockDsl clock;

    private UseCaseDsl(UseCaseContext context,
                      Supplier<ShopDriver> shopDriverSupplier,
                      Supplier<ErpDriver> erpDriverSupplier,
                      Supplier<TaxDriver> taxDriverSupplier,
                      Supplier<ClockDriver> clockDriverSupplier) {
        this.context = context;
        this.shopDriverSupplier = shopDriverSupplier;
        this.erpDriverSupplier = erpDriverSupplier;
        this.taxDriverSupplier = taxDriverSupplier;
        this.clockDriverSupplier = clockDriverSupplier;
    }

    public UseCaseDsl(Configuration configuration, ShopDriver shopDriver, ErpDriver erpDriver, TaxDriver taxDriver, ClockDriver clockDriver) {
        this(
                configuration,
                () -> shopDriver,
                () -> erpDriver,
                () -> taxDriver,
                () -> clockDriver
        );
    }

    public UseCaseDsl(Configuration configuration,
                     Supplier<ShopDriver> shopDriverSupplier,
                     Supplier<ErpDriver> erpDriverSupplier,
                     Supplier<TaxDriver> taxDriverSupplier,
                     Supplier<ClockDriver> clockDriverSupplier) {
        this(new UseCaseContext(configuration.getExternalSystemMode()), shopDriverSupplier, erpDriverSupplier, taxDriverSupplier, clockDriverSupplier);
    }

    @Override
    public void close() {
        if (shop != null) {
            Closer.close(shop);
        } else {
            Closer.close(shopDriver);
        }

        if (erp != null) {
            Closer.close(erp);
        } else {
            Closer.close(erpDriver);
        }

        if (tax != null) {
            Closer.close(tax);
        } else {
            Closer.close(taxDriver);
        }

        if (clock != null) {
            Closer.close(clock);
        } else {
            Closer.close(clockDriver);
        }
    }

    public ShopDsl shop() {
        return getOrCreate(shop, () -> {
            shopDriver = getOrCreate(shopDriver, shopDriverSupplier);
            shop = new ShopDsl(shopDriver, context);
            return shop;
        });
    }

    public ErpDsl erp() {
        return getOrCreate(erp, () -> {
            erpDriver = getOrCreate(erpDriver, erpDriverSupplier);
            erp = new ErpDsl(erpDriver, context);
            return erp;
        });
    }

    public TaxDsl tax() {
        return getOrCreate(tax, () -> {
            taxDriver = getOrCreate(taxDriver, taxDriverSupplier);
            tax = new TaxDsl(taxDriver, context);
            return tax;
        });
    }

    public ClockDsl clock() {
        return getOrCreate(clock, () -> {
            clockDriver = getOrCreate(clockDriver, clockDriverSupplier);
            clock = new ClockDsl(clockDriver, context);
            return clock;
        });
    }

    private static <T> T getOrCreate(T instance, Supplier<T> supplier) {
        return instance != null ? instance : supplier.get();
    }
}



