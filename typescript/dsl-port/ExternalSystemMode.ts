/**
 * STUB = parameterized/generated values; REAL = literal values.
 * STUB = use generated/parameterized values (e.g. for contract tests).
 * REAL = use literal values (e.g. for e2e against real services).
 */
export const ExternalSystemMode = {
  STUB: 'STUB',
  REAL: 'REAL',
} as const;
export type ExternalSystemMode = (typeof ExternalSystemMode)[keyof typeof ExternalSystemMode];