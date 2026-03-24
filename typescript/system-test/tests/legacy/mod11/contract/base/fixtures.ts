import { ScenarioDsl } from '@optivem/dsl-core/scenario/ScenarioDsl.js';
import type { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { withApp, withScenario } from '../../../../../src/index.js';

export const test = withScenario(withApp(), (useCase: UseCaseDsl) => new ScenarioDsl(useCase));

export { expect } from '@playwright/test';
