import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/dsl-core/shared';
import type { SystemError } from '../../commons/dtos/errors/SystemError.js';
import { SystemErrorFailureVerification } from './SystemErrorFailureVerification.js';

export abstract class BaseShopCommand<TResponse, TVerification> extends BaseUseCase<
    ShopDriver,
    TResponse,
    SystemError,
    TVerification,
    SystemErrorFailureVerification
> {
    protected constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }
}




