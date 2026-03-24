import '../../../../setup-config.js';
import { test, expect } from './base/fixtures.js';
import { testConfig } from '../../../../src/index.js';

const shopApiBaseUrl = testConfig.urls.shopApi;

test('should not be able to view non-existent order', async () => {
    const response = await fetch(`${shopApiBaseUrl}/api/orders/NON-EXISTENT-ORDER-99999`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.detail).toBe('Order NON-EXISTENT-ORDER-99999 does not exist.');
});