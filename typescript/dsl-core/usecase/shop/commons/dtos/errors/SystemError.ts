import type {
    SystemError,
    SystemErrorField,
} from '@optivem/driver-port/shop/dtos/errors/SystemError.js';

export type {
    SystemError,
    SystemErrorField,
} from '@optivem/driver-port/shop/dtos/errors/SystemError.js';

export function systemErrorOf(message: string, fields?: SystemErrorField[]): SystemError {
    return { message, fields };
}

/**
 * Minimal shape of an API error body (e.g. RFC 7807) that systemErrorFrom can convert.
 * Kept in commons so we do not depend on client; client's ProblemDetailResponse is structurally compatible.
 */
export interface ProblemDetailLike {
    detail?: string;
    errors?: Array<{ field?: string; message?: string; code?: string }>;
}

export function systemErrorFrom(problemDetail: ProblemDetailLike): SystemError {
    const message = problemDetail.detail ?? 'Request failed';
    if (problemDetail.errors != null && problemDetail.errors.length > 0) {
        const fieldErrors: SystemErrorField[] = problemDetail.errors.map((e) => ({
            field: e.field ?? '',
            message: e.message ?? '',
            code: e.code,
        }));
        return systemErrorOf(message, fieldErrors);
    }
    return systemErrorOf(message);
}

/** String representation for setResultEntryFailed. */
export function systemErrorToString(error: SystemError): string {
    if (error.fields == null || error.fields.length === 0) {
        return `SystemError{message='${error.message}'}`;
    }
    const fieldsStr = error.fields.map((f) => `FieldError{field='${f.field}', message='${f.message}'${f.code != null ? `, code='${f.code}'` : ''}}`).join(', ');
    return `SystemError{message='${error.message}', fieldErrors=[${fieldsStr}]}`;
}
