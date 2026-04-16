/**
 * V7 Clock Contract Tests.
 * Runs for both STUB and REAL external system modes; stub-only tests are skipped for REAL.
 *
 * Serial mode prevents parallel workers from interfering via the shared stub clock endpoint.
 */
import '../../../../setup-config.js';
import { test } from '../base/fixtures.js';

// Serial: all clock tests share the same stub endpoint, so they must not run in parallel.
test.describe.configure({ mode: 'serial' });

test.describe('Clock Contract Tests', () => {
    test('should be able to get time', async ({ scenario }) => {
        (await scenario
            .given()
            .then().clock())
            .hasTime();
    });
});
