package com.optivem.eshop.dsl.core.usecase.shop.usecases;

import com.optivem.eshop.dsl.driver.port.shop.dtos.BrowseCouponsResponse;
import com.optivem.eshop.dsl.driver.port.shop.ShopDriver;
import com.optivem.eshop.dsl.core.usecase.shop.usecases.base.BaseShopUseCase;
import com.optivem.eshop.dsl.core.shared.UseCaseResult;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;

public class BrowseCoupons extends BaseShopUseCase<BrowseCouponsResponse, BrowseCouponsVerification> {
    public BrowseCoupons(ShopDriver driver, UseCaseContext context) {
        super(driver, context);
    }

    @Override
    public UseCaseResult<BrowseCouponsResponse, BrowseCouponsVerification> execute() {
        var result = driver.browseCoupons();
        return new UseCaseResult<>(result, context, BrowseCouponsVerification::new);
    }
}



