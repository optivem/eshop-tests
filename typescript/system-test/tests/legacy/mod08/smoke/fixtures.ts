import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { withApp, withScenario } from '../../../../src/index.js';

/**
 * V6 base fixtures: useCase (UseCaseDsl) and scenario (ScenarioDsl). Shop uses scenario; external uses useCase.
 */
const _test = withScenario(withApp(), (useCase: UseCaseDsl) => new ScenarioDsl(useCase));
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
