import { bindChannels, bindTestEach } from '@optivem/optivem-testing';
import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { withApp, withScenario } from '../../../src/index.js';

/**
 * V7 base fixtures: provides useCase (UseCaseDsl) and scenario (ScenarioDsl).
 * Lifecycle: create useCase from configuration, scenario = new ScenarioDsl(useCase); tearDown close(useCase).
 */
const _test = withScenario(withApp(), (useCase: UseCaseDsl) => new ScenarioDsl(useCase));
const test = Object.assign(_test, { each: bindTestEach(_test) });

const { forChannels } = bindChannels(test);

export { test, forChannels };
export { expect } from '@playwright/test';
