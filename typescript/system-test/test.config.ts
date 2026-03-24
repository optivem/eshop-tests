import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';

export interface TestConfig {
  urls: {
    shopUi: string;
    shopApi: string;
    erpApi: string;
    taxApi: string;
    clockApi: string;
  };
}

/** Resolves external system mode from env (for tests that need to pass it into load/create). */
export function getExternalSystemMode(): ExternalSystemMode {
  return (process.env.EXTERNAL_SYSTEM_MODE?.toUpperCase() as 'STUB' | 'REAL') === 'STUB'
    ? ExternalSystemMode.STUB
    : ExternalSystemMode.REAL;
}

/**
 * Mode-aware URL defaults — mirrors .NET appsettings.*.stub.json / appsettings.*.real.json.
 */
function isStub(): boolean {
  return getExternalSystemMode() === ExternalSystemMode.STUB;
}

export const testConfig: TestConfig = {
  urls: {
    shopUi:   process.env.SHOP_UI_BASE_URL  || (isStub() ? 'http://localhost:3002' : 'http://localhost:3001'),
    shopApi:  process.env.SHOP_API_BASE_URL || (isStub() ? 'http://localhost:8082' : 'http://localhost:8081'),
    erpApi:   process.env.ERP_API_BASE_URL  || (isStub() ? 'http://localhost:9002/erp'   : 'http://localhost:9001/erp'),
    taxApi:   process.env.TAX_API_BASE_URL  || (isStub() ? 'http://localhost:9002/tax'   : 'http://localhost:9001/tax'),
    clockApi: process.env.CLOCK_API_BASE_URL || (isStub() ? 'http://localhost:9002/clock' : 'http://localhost:9001/clock'),
  },
};



