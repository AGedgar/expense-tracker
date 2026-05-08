import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { getEnv } from "../env";

let cachedDocumentClient: DynamoDBDocumentClient | undefined;

export const getDocumentClient = (): DynamoDBDocumentClient => {
  if (cachedDocumentClient) {
    return cachedDocumentClient;
  }

  const env = getEnv();
  const client = new DynamoDBClient({
    region: env.AWS_REGION
  });

  cachedDocumentClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true
    }
  });

  return cachedDocumentClient;
};

export const clearDocumentClientCache = (): void => {
  cachedDocumentClient = undefined;
};
