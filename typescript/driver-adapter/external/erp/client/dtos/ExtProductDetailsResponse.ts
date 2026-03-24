import type { Decimal } from '@optivem/commons';

export interface ExtProductDetailsResponse {
    id: string;
    title: string;
    description: string;
    price: Decimal;
    category: string;
    brand: string;
}
