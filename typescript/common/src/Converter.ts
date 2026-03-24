import type { Optional } from './Optional.js';
import { Decimal } from './Decimal.js';

/**
 * Type/string conversion helpers (decimal, integer, toDate, fromInstant).
 */
export class Converter {
    private constructor() {}

    static toDecimal(value: Optional<string>): Decimal | null {
        return this.to(value, (s) => Decimal.fromString(s));
    }

    /** Number to Decimal. */
    static toDecimalFromNumber(value: number): Decimal {
        return Decimal.fromNumber(value);
    }

    static fromDecimal(value: Decimal | null | undefined): Optional<string> {
        return value == null ? null : value.toString();
    }

    /** Number to decimal string. */
    static fromDouble(value: number): string {
        return Decimal.fromNumber(value).toString();
    }

    static toInteger(value: Optional<string>, ...nullValues: string[]): number | null {
        if (value == null || value.trim() === '') return null;
        for (const nv of nullValues) {
            if (value.localeCompare(nv, undefined, { sensitivity: 'accent' }) === 0) return null;
        }
        return this.to(value, (s) => parseInt(s, 10));
    }

    static fromInteger(value: number | null | undefined): Optional<string> {
        return value == null ? null : String(value);
    }

    static toDate(text: Optional<string>, ...nullValues: string[]): Date | null {
        const simple = this.to(text, (s) => new Date(s));
        if (simple !== null && !Number.isNaN(simple.getTime())) return simple;
        if (simple === null) return null;

        if (text == null || text.trim() === '') return null;
        for (const nv of nullValues) {
            if (text.localeCompare(nv, undefined, { sensitivity: 'accent' }) === 0) return null;
        }
        const iso = Date.parse(text);
        if (!Number.isNaN(iso)) return new Date(iso);
        const localeFormats = [
            /(\d{1,2})\/(\d{1,2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i,
            /(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2}):(\d{2}):(\d{2})/,
            /(\d{4})-(\d{2})-(\d{2})\s*(\d{2}):(\d{2}):(\d{2})/,
        ];
        for (const _ of localeFormats) {
            const d = new Date(text);
            if (!Number.isNaN(d.getTime())) return d;
        }
        throw new Error(`Invalid date format: ${text} - Expected ISO format or locale-specific format.`);
    }

    static fromDate(value: Date | null | undefined): Optional<string> {
        return value == null ? null : value.toISOString();
    }

    /**
     * Normalizes Date | string to Date | null.
     * If value is already a Date, returns it (or null if invalid). If string, parses it.
     */
    static normalizeToDate(value: Optional<Date | string>): Date | null {
        if (value == null) return null;
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    private static to<T>(value: Optional<string>, converter: (s: string) => T): T | null {
        if (value == null || value.trim() === '') return null;
        return converter(value);
    }
}
