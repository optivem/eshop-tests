import type { JsonHttpClient } from '@optivem/driver-adapter/client/http';
import type { Optional, Result } from '@optivem/commons';
import type { ProblemDetailResponse } from '../dtos/errors/ProblemDetailResponse.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../../../commons/dtos/index.js';

export class OrderController {
    private static readonly ENDPOINT = '/api/orders';

    constructor(private readonly httpClient: JsonHttpClient<ProblemDetailResponse>) {}

    placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, ProblemDetailResponse>> {
        return this.httpClient.postAsync<PlaceOrderResponse>(OrderController.ENDPOINT, request);
    }

    viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, ProblemDetailResponse>> {
        return this.httpClient.getAsync<ViewOrderResponse>(`${OrderController.ENDPOINT}/${orderNumber}`);
    }

    cancelOrder(orderNumber: Optional<string>): Promise<Result<void, ProblemDetailResponse>> {
        return this.httpClient.postAsync<void>(`${OrderController.ENDPOINT}/${orderNumber}/cancel`, {});
    }
}




