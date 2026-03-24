/**
 * V5 e2e fixtures: useCase (UseCaseDsl).
 * Mirrors reference V5 BaseE2eTest (BaseSystemDslTest with REAL mode).
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'REAL';

import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { withApp } from '../../../../../src/index.js';

const _test = withApp();
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
