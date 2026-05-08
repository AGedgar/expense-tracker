# Expense Tracker

Expense Tracker is a focused full-stack application for tracking personal spending, organizing expenses by category, and viewing simple spending reports.

## Project Scope

Core features:

- Email and password authentication with JWT.
- Create, edit, delete, and list expenses.
- Filter expenses by date range and category.
- Predefined and custom user categories.
- Monthly spending summary.
- Spending breakdown by category.
- Responsive frontend.
- Loading states, validation, error handling, environment management, basic logging, and input sanitization.

## Technology Decisions

- **Monorepo:** pnpm workspace.
- **Frontend:** React, TypeScript, Vite, MUI, React Query.
- **Backend:** TypeScript AWS Lambda handlers behind API Gateway.
- **Database:** DynamoDB with a simple single-table design.
- **Infrastructure:** Serverless Framework.
- **Validation:** Zod.
- **Authentication:** JWT and bcrypt.
- **Testing:** Jest.

## Why Lambda Handlers Without Express?

The backend is designed for AWS Lambda and API Gateway, not for a long-running Node.js server. API Gateway handles HTTP routing and invokes small Lambda handlers for each route.

This keeps the serverless model direct:

- Fewer runtime dependencies.
- Smaller request handling surface.
- Clear mapping between API routes and use cases.
- No Express adapter layer inside Lambda.
- Easier alignment with API Gateway events and Lambda responses.

The tradeoff is that the project needs small shared helpers for parsing requests, returning HTTP responses, handling errors, and validating authentication. For this scope, that boilerplate is acceptable and keeps the architecture explicit.

## Why Serverless Framework?

Serverless Framework is used because the infrastructure needs are focused:

- AWS Lambda.
- API Gateway.
- DynamoDB.
- IAM permissions.
- Environment variables.

## Monorepo Structure

```txt
expense-tracker/
  apps/
    api/
      src/
        modules/
          auth/
          categories/
          expenses/
          reports/
        shared/
          auth/
          db/
          env/
          errors/
          http/
    web/
  packages/
    shared/
      src/
        constants/
        schemas/
        types/
  infra/
```

## Backend Architecture

The backend uses a lightweight modular architecture organized by product capability:

```txt
modules/
  auth/
  categories/
  expenses/
  reports/
```

Each module owns its feature-specific handlers, services, repositories, schemas, and tests.

The request flow is:

```txt
API Gateway
  -> Lambda handler
  -> input validation and auth context
  -> service
  -> repository
  -> DynamoDB
```

Layer responsibilities:

- **Handler:** parse API Gateway input, validate body/query/path params, enforce authentication, and return HTTP responses.
- **Service:** apply business rules and coordinate repository calls.
- **Repository:** read and write DynamoDB records.
- **Shared:** provide reusable auth, database, environment, error, and HTTP utilities.

This modular approach keeps code related to one feature close together while shared infrastructure concerns remain centralized.

## DynamoDB Data Model

The application uses a single DynamoDB table.

```txt
Table: expense-tracker-dev
PK: string
SK: string
```

Primary access pattern:

```txt
Fetch data owned by the authenticated user.
```

Items:

```txt
User profile
PK = USER#{userId}
SK = PROFILE

Category
PK = USER#{userId}
SK = CATEGORY#{categoryId}

Expense
PK = USER#{userId}
SK = EXPENSE#{date}#{expenseId}
```

Example expense item:

```ts
{
  PK: "USER#u_123",
  SK: "EXPENSE#2026-05-05#exp_456",
  entityType: "EXPENSE",
  expenseId: "exp_456",
  userId: "u_123",
  amount: 250.75,
  description: "Groceries",
  categoryId: "cat_food",
  date: "2026-05-05",
  createdAt: "2026-05-05T12:00:00.000Z",
  updatedAt: "2026-05-05T12:00:00.000Z"
}
```

This design favors the main access patterns: listing a user's expenses by date, loading their categories, and calculating reports for a selected period.

```txt
GSI1PK = USER#{userId}#CATEGORY#{categoryId}
GSI1SK = EXPENSE#{date}#{expenseId}
```

## Expected API Endpoints

Authentication:

```txt
POST /auth/signup
POST /auth/login
GET  /me
```

Categories:

```txt
GET    /categories
POST   /categories
PUT    /categories/{categoryId}
DELETE /categories/{categoryId}
```

Expenses:

```txt
GET    /expenses?from=2026-05-01&to=2026-05-31&categoryId=cat_food
POST   /expenses
GET    /expenses/{expenseId}
PUT    /expenses/{expenseId}
DELETE /expenses/{expenseId}
```

Reports:

```txt
GET /reports/monthly?month=2026-05
GET /reports/categories?from=2026-05-01&to=2026-05-31
```

## AWS Cost Awareness

The architecture is designed to stay friendly to the AWS free tier:

- Lambda for serverless compute.
- DynamoDB with low provisioned capacity.
- API Gateway for HTTP routing.
- CloudWatch logs with moderate logging.

## Environment Variables

Backend environment variables are documented in:

```txt
apps/api/.env.example
```

Expected backend variables:

| Variable | Description |
| --- | --- |
| `AWS_REGION` | AWS region used by the local API and Serverless deployment. Example: `us-east-1`. |
| `DYNAMODB_TABLE_NAME` | DynamoDB table used by the API. The default deployed table is `expense-tracker-dev`. |
| `JWT_SECRET` | Secret used to sign and verify JWT tokens. Must be at least 32 characters. |
| `JWT_EXPIRES_IN` | JWT expiration time. Example: `1h`. |

Frontend environment variables are documented in:

```txt
apps/web/.env.example
```

Expected frontend variables:

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL used by the frontend to call the API. Use `http://127.0.0.1:3000` for local API development, or the deployed API URL for live API review. |

`DYNAMODB_TABLE_NAME` should match an existing DynamoDB table when running the API locally. During deployment, Serverless Framework creates `expense-tracker-dev` by default.

## Local Development

There are two recommended review paths.

### Live Review

Use the deployed frontend URL. This path does not require local AWS credentials.

### Local Review with AWS DynamoDB

This path runs the frontend and API locally, while the API connects to DynamoDB in AWS.

Prerequisites:

- Node.js 20+.
- pnpm.
- AWS CLI configured with credentials.
- AWS permissions for Lambda, API Gateway, DynamoDB, IAM, and CloudFormation.

Create backend env file:

```txt
cp apps/api/.env.example apps/api/.env
```

Then update:

```txt
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=expense-tracker-dev
JWT_SECRET=replace-with-a-secure-secret-at-least-32-characters
JWT_EXPIRES_IN=1h
```

Create frontend env file:

```txt
cp apps/web/.env.example apps/web/.env
```

For local API development:

```txt
VITE_API_BASE_URL=http://127.0.0.1:3000
```

This project runs the API locally with `serverless offline`, but it still uses AWS DynamoDB as the database. Before running the full local stack, make sure the DynamoDB table exists in the AWS account configured in your AWS CLI profile.

If the table does not exist yet, deploy the API once:

```txt
pnpm run deploy:api
```

That command creates the DynamoDB table, API Gateway routes, Lambda functions, and required IAM permissions in AWS.

Expected workflow:

```txt
pnpm install
pnpm run build
pnpm run dev
pnpm test
```

After the DynamoDB table exists and the `.env` files are in place, `pnpm run dev` starts both the local API and the frontend.

Run only one app if needed:

```txt
pnpm run dev:web
pnpm run dev:api
```

## Deployment

Deployment will be handled with Serverless Framework.

The backend infrastructure lives in:

```txt
apps/api/serverless.yml
```

Current deployed API URL:

```txt
https://nwgoih6ajd.execute-api.us-east-1.amazonaws.com
```

Package the API locally:

```txt
pnpm run package:api
```

Deploy the API:

```txt
pnpm run deploy:api
```

Remove deployed AWS resources:

```txt
pnpm run remove:api
```

The deployment creates Lambda functions, API Gateway HTTP API routes, a DynamoDB table, and a GSI for email lookup.
