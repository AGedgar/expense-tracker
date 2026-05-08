# Infrastructure Notes

The backend infrastructure is defined with Serverless Framework in:

```txt
apps/api/serverless.yml
```

This file declares:

- AWS Lambda functions.
- API Gateway HTTP API routes.
- A DynamoDB single-table resource.
- A GSI for email lookup during authentication.
- Least-privilege DynamoDB permissions for the Lambda role.

## Cost-Aware Choices

The infrastructure is designed to stay small and free-tier friendly:

- Lambda uses `128 MB` memory and short timeouts.
- Lambda uses `arm64`, which is generally cheaper than x86.
- DynamoDB uses `PROVISIONED` capacity with `1 RCU / 1 WCU`.
- API Gateway uses HTTP API routes.
- No RDS, NAT Gateway, DocumentDB, custom domains, SES, or S3 uploads are included.
- No custom CloudWatch dashboards, alarms, metrics, or log retention resources are created.

AWS Lambda can still emit platform logs to CloudWatch when deployed. The application keeps logging minimal and only logs unexpected errors. For this assessment scope, that should remain very low cost, but AWS billing always depends on account eligibility, region, usage, and active resources.

## Deployment Flow

From the repo root:

```txt
pnpm install
pnpm run package:api
pnpm run deploy:api
```

To remove deployed resources:

```txt
pnpm run remove:api
```
