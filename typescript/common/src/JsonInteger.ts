import { Integer } from './Integer.js';

/**
 * Default JSON property names that should be deserialized as Integer.
 * Add more as needed; or pass a custom set to mapObjectIntegers.
 */
export const DEFAULT_INTEGER_KEYS = new Set<string>(['usageLimit', 'usedCount', 'quantity']);

/**
 * Recursively walks a plain object (e.g. from JSON.parse or axios response) and converts
 * any property whose key is in integerKeys to Integer. Use for any DTO type that has Integer fields.
 * Null/undefined values are left as-is (for optional fields).
 *
 * @param obj - Already-parsed JSON object (or array)
 * @param integerKeys - Keys to convert (default: DEFAULT_INTEGER_KEYS)
 * @returns New object/array with those keys as Integer instances
 */
function isPlainObject(value: unknown): boolean {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export function mapObjectIntegers<T>(
    obj: T,
    integerKeys: Set<string> = DEFAULT_INTEGER_KEYS
): T {
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => mapObjectIntegers(item, integerKeys)) as T;
    }
    // Do not recurse into class instances (e.g. Decimal, Integer) — only plain objects
    if (!isPlainObject(obj)) {
        return obj;
    }
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        if (integerKeys.has(key) && value != null) {
            result[key] = Integer.fromJson(value);
        } else {
            result[key] = mapObjectIntegers(value, integerKeys);
        }
    }
    return result as T;
}
