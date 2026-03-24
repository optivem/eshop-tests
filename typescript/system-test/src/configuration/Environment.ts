/** Test environment. */
export const Environment = {
    LOCAL: 'LOCAL',
    ACCEPTANCE: 'ACCEPTANCE',
    QA: 'QA',
    PRODUCTION: 'PRODUCTION',
} as const;
export type Environment = (typeof Environment)[keyof typeof Environment];
