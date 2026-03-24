import type { Integer } from '@optivem/commons';

export interface CouponDto {
	code: string;
	discountRate: number;
	validFrom: Date | string;
	validTo: Date | string;
	usageLimit?: Integer;
	usedCount?: Integer;
}

export interface BrowseCouponsResponse {
	coupons: CouponDto[];
}
