import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { Environment } from './Environment.js';

/**
 * Loads environment and external system mode from process.env.
 */
export function getEnvironment(fixed: Environment | null | undefined): Environment {
    if (fixed != null) {
        return fixed;
    }
    const value = process.env.ENVIRONMENT;
    if (value == null || value === '') {
        throw new Error(
            "Environment variable 'ENVIRONMENT' is not defined. Please set ENVIRONMENT=<local|acceptance|qa|production>"
        );
    }
    const key = value.toUpperCase();
    if (key in Environment) {
        return Environment[key as keyof typeof Environment];
    }
    throw new Error(`Invalid ENVIRONMENT: ${value}. Allowed: local, acceptance, qa, production`);
}

export function getExternalSystemMode(fixed: ExternalSystemMode | null | undefined): ExternalSystemMode {
    if (fixed != null) {
        return fixed;
    }
    const value = process.env.EXTERNAL_SYSTEM_MODE;
    if (value == null || value === '') {
        throw new Error(
            "Environment variable 'EXTERNAL_SYSTEM_MODE' is not defined. Please set EXTERNAL_SYSTEM_MODE=<stub|real>"
        );
    }
    const key = value.toUpperCase();
    if (key === 'STUB') return ExternalSystemMode.STUB;
    if (key === 'REAL') return ExternalSystemMode.REAL;
    throw new Error(`Invalid EXTERNAL_SYSTEM_MODE: ${value}. Allowed: stub, real`);
}

