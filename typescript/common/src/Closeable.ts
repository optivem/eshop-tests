/**
 * Objects that hold resources and can be closed synchronously.
 * Synchronous disposable (dispose).
 * Prefer closing in reverse order of creation (e.g. page → context → browser).
 */
export interface Closeable {
    close(): void;
}
