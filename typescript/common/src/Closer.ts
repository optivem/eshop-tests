import type { Closeable } from './Closeable.js';
import type { AsyncCloseable } from './AsyncCloseable.js';

/**
 * Safe close for closeable resources. Rethrows on failure so callers can handle.
 * Accepts Closeable (sync), AsyncCloseable (async), or any object with optional close();
 * awaits when close() returns a Promise. No-op if close is missing.
 */
export class Closer {
    static async close(closeable: Closeable | AsyncCloseable | { close?: () => void | Promise<void> } | null | undefined): Promise<void> {
        if (closeable == null || typeof closeable.close !== 'function') {
            return;
        }
        try {
            const result = closeable.close();
            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            throw new Error('Failed to close resource', { cause: error });
        }
    }
}
