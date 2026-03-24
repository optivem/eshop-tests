import { bindChannels } from '@optivem/optivem-testing';
import { withApp } from '../../../../src/index.js';

/**
 * V5 base fixtures: provides useCase (UseCaseDsl). Same as V7 but tests use useCase.shop()/erp()/tax()/clock() directly.
 */
const test = withApp();

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
