/**
 * V7 Clock Stub Contract Tests.
 * Runs only for STUB external system mode.
 */
import '../../../../../setup-config.js';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { test } from '../base/fixtures.js';
import { getExternalSystemMode } from '../../../../../src/index.js';

test.describe.configure({ mode: 'serial' });

test.describe('Clock Stub Contract Tests', () => {
	test.skip(
		() => getExternalSystemMode() !== ExternalSystemMode.STUB,
		'Stub-only tests — skipped when EXTERNAL_SYSTEM_MODE is not STUB'
	);

	test('should be able to get configured time', async ({ scenario }) => {
		(await scenario
			.given().clock().withTime('2024-01-02T09:00:00Z')
			.then().clock())
			.hasTime('2024-01-02T09:00:00Z');
	});
});

