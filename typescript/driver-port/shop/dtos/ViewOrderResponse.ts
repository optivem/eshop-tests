import type { Decimal, Integer } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { OrderStatus } from './OrderStatus.js';

export interface ViewOrderResponse {
	orderNumber: string;
	orderTimestamp?: Date;
	sku: string;
	quantity: Integer;
	unitPrice: Decimal;
	basePrice: Decimal;
	discountRate: Decimal;
	discountAmount: Decimal;
	subtotalPrice: Decimal;
	preTaxTotal?: Decimal;
	taxRate: Decimal;
	taxAmount: Decimal;
	totalPrice: Decimal;
	status: OrderStatus;
	country: string;
	appliedCouponCode?: Optional<string>;
}
