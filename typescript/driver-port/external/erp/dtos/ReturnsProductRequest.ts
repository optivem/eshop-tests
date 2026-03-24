import type { Optional } from '@optivem/commons';

export interface ReturnsProductRequest {
	sku?: Optional<string>;
	price?: Optional<string>;
}
