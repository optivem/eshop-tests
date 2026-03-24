package com.optivem.eshop.systemtest.configuration;

import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.usecase.Configuration;
import com.optivem.eshop.dsl.driver.port.external.clock.ClockDriver;
import com.optivem.eshop.dsl.driver.port.external.erp.ErpDriver;
import com.optivem.eshop.dsl.channel.ChannelType;
import com.optivem.eshop.dsl.driver.port.shop.ShopDriver;
import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.driver.adapter.external.clock.ClockRealDriver;
import com.optivem.eshop.dsl.driver.adapter.external.clock.ClockStubDriver;
import com.optivem.eshop.dsl.driver.adapter.external.erp.ErpRealDriver;
import com.optivem.eshop.dsl.driver.adapter.external.erp.ErpStubDriver;
import com.optivem.eshop.dsl.driver.adapter.shop.api.ShopApiDriver;
import com.optivem.eshop.dsl.driver.adapter.shop.ui.ShopUiDriver;
import com.optivem.eshop.dsl.driver.adapter.external.tax.TaxRealDriver;
import com.optivem.eshop.dsl.driver.adapter.external.tax.TaxStubDriver;
import com.optivem.eshop.systemtest.infrastructure.playwright.BrowserLifecycleExtension;
import com.optivem.eshop.dsl.port.ExternalSystemMode;
import com.optivem.testing.contexts.ChannelContext;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(BrowserLifecycleExtension.class)
public abstract class BaseConfigurableTest {
    protected Environment getFixedEnvironment() {
        return null;
    }

    protected ExternalSystemMode getFixedExternalSystemMode() {
        return null;
    }

    protected Configuration loadConfiguration() {
        var fixedEnvironment = getFixedEnvironment();
        var fixedExternalSystemMode = getFixedExternalSystemMode();

        var environment = PropertyLoader.getEnvironment(fixedEnvironment);
        var externalSystemMode = PropertyLoader.getExternalSystemMode(fixedExternalSystemMode);
        return ConfigurationLoader.load(environment, externalSystemMode);
    }

    protected UseCaseDsl createUseCaseDsl(Configuration configuration) {
        return new UseCaseDsl(
                configuration,
                () -> createShopDriver(configuration),
                () -> createErpDriver(configuration),
                () -> createTaxDriver(configuration),
                () -> createClockDriver(configuration)
        );
    }

    private ShopDriver createShopDriver(Configuration configuration) {
        var channel = ChannelContext.get();
        if (ChannelType.UI.equals(channel)) {
            return new ShopUiDriver(configuration.getShopUiBaseUrl(), BrowserLifecycleExtension.getBrowser());
        } else if (ChannelType.API.equals(channel)) {
            return new ShopApiDriver(configuration.getShopApiBaseUrl());
        } else {
            throw new IllegalStateException("Unknown channel: " + channel);
        }
    }

    private ErpDriver createErpDriver(Configuration configuration) {
        return switch (configuration.getExternalSystemMode()) {
            case REAL -> new ErpRealDriver(configuration.getErpBaseUrl());
            case STUB -> new ErpStubDriver(configuration.getErpBaseUrl());
        };
    }

    private TaxDriver createTaxDriver(Configuration configuration) {
        return switch (configuration.getExternalSystemMode()) {
            case REAL -> new TaxRealDriver(configuration.getTaxBaseUrl());
            case STUB -> new TaxStubDriver(configuration.getTaxBaseUrl());
        };
    }

    private ClockDriver createClockDriver(Configuration configuration) {
        return switch (configuration.getExternalSystemMode()) {
            case REAL -> new ClockRealDriver();
            case STUB -> new ClockStubDriver(configuration.getClockBaseUrl());
        };
    }
}



