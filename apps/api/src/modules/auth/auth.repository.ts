import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { getDocumentClient } from "../../shared/db";
import type { CategoryItem, UserItem } from "../../shared/db";
import { categorySk, emailPk, profileSk, userPk } from "../../shared/db";
import { getEnv } from "../../shared/env";

export type AuthRepository = {
  findUserByEmail: (email: string) => Promise<UserItem | undefined>;
  createUserWithCategories: (
    user: UserItem,
    categories: CategoryItem[]
  ) => Promise<void>;
};

export const createAuthRepository = (): AuthRepository => {
  const documentClient = getDocumentClient();
  const env = getEnv();

  return {
    async findUserByEmail(email) {
      const result = await documentClient.send(
        new QueryCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          IndexName: "GSI1",
          KeyConditionExpression: "GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk",
          ExpressionAttributeValues: {
            ":gsi1pk": emailPk(email),
            ":gsi1sk": profileSk()
          },
          Limit: 1
        })
      );

      return result.Items?.[0] as UserItem | undefined;
    },

    async createUserWithCategories(user, categories) {
      const items = [user, ...categories];

      await Promise.all(
        items.map((item) =>
          documentClient.send(
            new PutCommand({
              TableName: env.DYNAMODB_TABLE_NAME,
              Item: item,
              ConditionExpression: "attribute_not_exists(PK)"
            })
          )
        )
      );
    }
  };
};

export const buildUserItem = (
  params: {
    userId: string;
    name: string;
    email: string;
    passwordHash: string;
  },
  now: string
): UserItem => ({
  PK: userPk(params.userId),
  SK: profileSk(),
  GSI1PK: emailPk(params.email),
  GSI1SK: profileSk(),
  entityType: "USER",
  userId: params.userId,
  name: params.name,
  email: params.email,
  passwordHash: params.passwordHash,
  createdAt: now,
  updatedAt: now
});

export const buildPredefinedCategoryItem = (
  params: {
    userId: string;
    categoryId: string;
    name: string;
  },
  now: string
): CategoryItem => ({
  PK: userPk(params.userId),
  SK: categorySk(params.categoryId),
  entityType: "CATEGORY",
  categoryId: params.categoryId,
  userId: params.userId,
  name: params.name,
  type: "PREDEFINED",
  createdAt: now,
  updatedAt: now
});
