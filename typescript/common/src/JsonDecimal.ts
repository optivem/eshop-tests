import { Decimal } from './Decimal.js';

/**
 * Default JSON property names that should be deserialized as Decimal.
 * Add more as needed; or pass a custom set to parseJsonWithDecimals / mapObjectDecimals.
 */
export const DEFAULT_DECIMAL_KEYS = new Set<string>([
    'price',
    'amount',
    'unitPrice',
    'basePrice',
    'subtotalPrice',
    'discountRate',
    'discountAmount',
    'totalPrice',
    'taxAmount',
    'total',
    'rate',
    'tax',
    'taxRate',
]);

/**
 * Recursively walks a plain object (e.g. from JSON.parse or axios response) and converts
 * any property whose key is in decimalKeys to Decimal. Use for any DTO type that has Decimal fields.
 *
 * @param obj - Already-parsed JSON object (or array)
 * @param decimalKeys - Keys to convert (default: DEFAULT_DECIMAL_KEYS)
 * @returns New object/array with those keys as Decimal instances
 */
function isPlainObject(value: unknown): boolean {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function mapObjectDecimals<T>(
    obj: T,
    decimalKeys: Set<string> = DEFAULT_DECIMAL_KEYS
): T {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => mapObjectDecimals(item, decimalKeys)) as T;
    }
    // Do not recurse into class instances (e.g. Integer, custom types) — only plain objects
    if (!isPlainObject(obj)) {
        return obj;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (decimalKeys.has(key)) {
            result[key] = Decimal.fromJson(value);
        } else {
            result[key] = mapObjectDecimals(value, decimalKeys);
        }
    }
    return result as T;
}

/**
 * Parses a JSON string and converts known decimal keys (at any nesting level) to Decimal.
 * Use when you have the raw string (e.g. from fetch/axios response text).
 *
 * @param json - JSON string
 * @param decimalKeys - Keys to convert (default: DEFAULT_DECIMAL_KEYS)
 */
export function parseJsonWithDecimals<T>(
    json: string,
    decimalKeys: Set<string> = DEFAULT_DECIMAL_KEYS
): T {
    const parsed = JSON.parse(json) as T;
    return mapObjectDecimals(parsed, decimalKeys);
}
