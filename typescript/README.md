# eShop Tests (TypeScript)

[![acceptance-stage](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml/badge.svg)](https://github.com/optivem/eshop-tests-typescript/actions/workflows/acceptance-stage.yml)

## Prerequisites

- Node.js 22 (LTS)
- Docker Desktop
- PowerShell 7+

Check that you have Powershell 7

```shell
$PSVersionTable.PSVersion
```

Check that you have Node.js 22 installed

```shell
node -v
```

Inside `monolith` and `system-test` install dependencies

```shell
npm install
```

Inside `system-test` install:

```shell
npx playwright install
```

## Run Everything

```powershell
.\run.ps1 all
```

This will:
1. Build the Monolith (compile TypeScript and create build)
2. Start Docker containers (Monolith, PostgreSQL, & Simulated External Systems)
3. Wait for services to be healthy
4. Run all System Tests

You can open these URLs in your browser:
- Monolith Application: [http://localhost:8082](http://localhost:8082)
- ERP API (JSON Server): [http://localhost:3200](http://localhost:3200)
- Tax API (JSON Server): [http://localhost:3201](http://localhost:3201)

## Separate Commands

### Build
Compiles the code and creates the Docker image (local mode only):
```powershell
.\run.ps1 build
```

### Start Services
Starts the Docker containers:
```powershell
# Local mode (uses locally built code)
.\run.ps1 start

# Pipeline mode (uses pre-built image from registry)
.\run.ps1 start pipeline
```

You can open these URLs in your browser:
- Monolith Application: [http://localhost:8082](http://localhost:8082)
- ERP API (JSON Server): [http://localhost:3200](http://localhost:3200)
- Tax API (JSON Server): [http://localhost:3201](http://localhost:3201)
- PostgreSQL Database: localhost:5434 (database: `eshop`, user: `eshop_user`, password: `eshop_password`)

### Run Tests
```powershell
.\Run-SystemTests.ps1
```

### Run a Specific Suite

Run only a specific test suite by ID:

```powershell
.\Run-SystemTests.ps1 -Suite v7-acceptance-api
```

### Run a Single Test

Run only one test method within a suite:

```powershell
.\Run-SystemTests.ps1 -Suite v7-acceptance-api -Test canPlaceOrder
```

### View Logs
```powershell
.\run.ps1 logs
```

### Stop Services
```powershell
.\run.ps1 stop
```

## Client Layer Architecture

This project implements the **Client Layer Pattern** for test automation, providing a clean abstraction over Playwright API and UI interactions. The Client Layer separates test logic from implementation details and makes tests more maintainable.

### Structure

```
system-test/
└── core/
    ├── clients/
    │   ├── commons/               # Shared test utilities
    │   │   ├── TestHttpClient.ts  # HTTP request wrapper
    │   │   └── TestPageClient.ts  # Browser interaction wrapper
    │   ├── system/                # System under test clients
    │   │   ├── api/               # API client
    │   │   │   ├── controllers/   # API endpoint controllers
    │   │   │   │   ├── EchoController.ts
    │   │   │   │   └── OrderController.ts
    │   │   │   ├── dtos/          # Data transfer objects
    │   │   │   │   ├── PlaceOrderRequest.ts
    │   │   │   │   ├── PlaceOrderResponse.ts
    │   │   │   │   ├── GetOrderResponse.ts
    │   │   │   │   └── OrderStatus.ts
    │   │   │   └── ShopApiClient.ts
    │   │   └── ui/                # UI client
    │   │       ├── pages/         # Page objects
    │   │       │   ├── HomePage.ts
    │   │       │   ├── NewOrderPage.ts
    │   │       │   └── OrderHistoryPage.ts
    │   │       └── ShopUiClient.ts
    │   ├── external/              # External system clients
    │   │   └── erp/
    │   │       ├── controllers/
    │   │       │   └── ProductController.ts
    │   │       ├── dtos/
    │   │       │   └── CreateProductResponse.ts
    │   │       └── ErpApiClient.ts
    │   ├── ClientFactory.ts       # Creates client instances
    │   └── Closer.ts        # Manages resource cleanup
    └── TestConfiguration.ts        # Test environment configuration
```

### Key Components

#### 1. Commons Layer
- **TestHttpClient**: Wraps Playwright's API request functionality with methods like `get()`, `post()`, and assertion helpers (`assertOk()`, `assertCreated()`, etc.)
- **TestPageClient**: Wraps Playwright's Page API with methods like `fill()`, `click()`, `readTextContent()`, providing consistent timeouts and error handling

#### 2. System Clients
- **ShopApiClient**: API client for the shop system with controller-based organization
- **ShopUiClient**: UI client for browser-based testing with page object pattern
- **Controllers**: Organize API endpoints (e.g., `OrderController` handles `/orders` endpoints)
- **Pages**: Encapsulate UI page interactions (e.g., `NewOrderPage` handles the order form)

#### 3. External Clients
- **ErpApiClient**: Client for interacting with external ERP system
- Allows tests to set up test data in external systems

#### 4. DTOs (Data Transfer Objects)
- Type-safe request/response objects
- Ensures consistency between tests and API contracts

### Usage Example

```typescript
import { test } from '@playwright/test';
import { ClientFactory } from '../../core/clients/ClientFactory';
import { Closer } from '../../core/clients/Closer';

test('should place an order via API', async () => {
  // Arrange
  const shopApiClient = await ClientFactory.createShopApiClient();
  const erpApiClient = await ClientFactory.createErpApiClient();

  try {
    // Create product in ERP system
    const sku = await erpApiClient.products().createProduct('TEST-SKU', 99.99);

    // Act - Place order
    const response = await shopApiClient.orders().placeOrder(sku, '5', 'US');

    // Assert
    const orderResponse = await shopApiClient.orders()
      .assertOrderPlacedSuccessfully(response);
    
    expect(orderResponse.orderNumber).toMatch(/ORD-/);
  } finally {
    // Cleanup
    await Closer.close(shopApiClient);
    await Closer.close(erpApiClient);
  }
});
```

### Benefits

1. **Separation of Concerns**: Tests focus on business logic, not technical details
2. **Reusability**: Clients and pages can be reused across multiple tests
3. **Maintainability**: Changes to API/UI only require updating the client layer
4. **Type Safety**: TypeScript ensures compile-time type checking
5. **Readability**: Tests read like business scenarios
6. **Resource Management**: Consistent cleanup with `Closer`

### Reference

This Client Layer implementation is based on the [Java reference project](https://github.com/optivem/eshop-tests-java/tree/main/system-test/src/test/java/com/optivem/eshop/systemtest/core/clients).

## License

[![MIT License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://opensource.org/licenses/MIT)

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Contributors

- [Valentina Jemuović](https://github.com/valentinajemuovic)
- [Jelena Cupać](https://github.com/jcupac)
