import type { Optional } from '@optivem/commons';

export interface PublishCouponRequest {
	code?: Optional<string>;
	discountRate?: Optional<string>;
	validFrom?: Optional<string>;
	validTo?: Optional<string>;
	usageLimit?: Optional<string>;
}
