/**
 * V8 acceptance test fixtures: same as smoke v8 but force STUB external system mode.
 */
process.env.EXTERNAL_SYSTEM_MODE = process.env.EXTERNAL_SYSTEM_MODE ?? 'STUB';

import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { withApp, withScenario } from '../../../../src/index.js';

const _test = withScenario(withApp(), (useCase: UseCaseDsl) => new ScenarioDsl(useCase));
type TestEach = ReturnType<typeof bindTestEach>;
const test: typeof _test & { each: TestEach } = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
