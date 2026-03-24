package com.optivem.eshop.dsl.core.usecase.external.tax;

import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.core.usecase.external.tax.usecases.GetTaxRate;
import com.optivem.eshop.dsl.core.usecase.external.tax.usecases.GoToTax;
import com.optivem.eshop.dsl.core.usecase.external.tax.usecases.ReturnsTaxRate;
import com.optivem.eshop.dsl.common.Closer;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;

import java.io.Closeable;

public class TaxDsl implements Closeable {
    private final TaxDriver driver;
    private final UseCaseContext context;

    public TaxDsl(TaxDriver driver, UseCaseContext context) {
        this.driver = driver;
        this.context = context;
    }

    @Override
    public void close() {
        Closer.close(driver);
    }

    public GoToTax goToTax() {
        return new GoToTax(driver, context);
    }

    public ReturnsTaxRate returnsTaxRate() {
        return new ReturnsTaxRate(driver, context);
    }

    public GetTaxRate getTaxRate() {
        return new GetTaxRate(driver, context);
    }
}
