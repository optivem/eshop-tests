import type { Optional } from '@optivem/commons';

export interface ExtCreateProductRequest {
    id?: Optional<string>;
    title?: Optional<string>;
    description?: Optional<string>;
    price?: Optional<string>;
    category?: Optional<string>;
    brand?: Optional<string>;
}
