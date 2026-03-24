/**
 * Type for integer values. Use this in DTOs and domain types instead of raw number
 * when the value is semantically an integer (e.g. counts, limits).
 */
export class Integer {
    private readonly value: number;

    private constructor(value: number) {
        this.value = value;
    }

    static fromNumber(n: number): Integer {
        const truncated = Number.isInteger(n) ? n : Math.trunc(n);
        if (!Number.isFinite(truncated)) {
            throw new TypeError(`Integer.fromNumber expects finite number, got ${n}`);
        }
        return new Integer(truncated);
    }

    static fromString(s: string): Integer {
        const n = parseInt(s, 10);
        if (Number.isNaN(n)) {
            throw new TypeError(`Integer.fromString expects numeric string, got ${s}`);
        }
        return new Integer(n);
    }

    /**
     * Deserialize from JSON: accepts number or string (e.g. from JSON.parse).
     */
    static fromJson(value: unknown): Integer {
        if (typeof value === 'number') return Integer.fromNumber(value);
        if (typeof value === 'string') return Integer.fromString(value);
        throw new TypeError(`Integer.fromJson expects number or string, got ${typeof value}`);
    }

    toNumber(): number {
        return this.value;
    }

    toString(): string {
        return String(this.value);
    }

    toJSON(): number {
        return this.value;
    }
}
