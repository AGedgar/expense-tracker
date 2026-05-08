import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { getDocumentClient } from "../../shared/db";
import type { CategoryItem } from "../../shared/db";
import { categorySk, userPk } from "../../shared/db";
import { getEnv } from "../../shared/env";

export type CategoryRepository = {
  listByUserId: (userId: string) => Promise<CategoryItem[]>;
  findById: (
    userId: string,
    categoryId: string
  ) => Promise<CategoryItem | undefined>;
  create: (category: CategoryItem) => Promise<void>;
  updateName: (
    userId: string,
    categoryId: string,
    name: string,
    updatedAt: string
  ) => Promise<CategoryItem | undefined>;
  deleteById: (userId: string, categoryId: string) => Promise<void>;
};

export const createCategoryRepository = (): CategoryRepository => {
  const documentClient = getDocumentClient();
  const env = getEnv();

  return {
    async listByUserId(userId) {
      const result = await documentClient.send(
        new QueryCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
          ExpressionAttributeValues: {
            ":pk": userPk(userId),
            ":skPrefix": "CATEGORY#"
          }
        })
      );

      return (result.Items ?? []) as CategoryItem[];
    },

    async findById(userId, categoryId) {
      const result = await documentClient.send(
        new GetCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: userPk(userId),
            SK: categorySk(categoryId)
          }
        })
      );

      return result.Item as CategoryItem | undefined;
    },

    async create(category) {
      await documentClient.send(
        new PutCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Item: category,
          ConditionExpression: "attribute_not_exists(PK)"
        })
      );
    },

    async updateName(userId, categoryId, name, updatedAt) {
      const result = await documentClient.send(
        new UpdateCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: userPk(userId),
            SK: categorySk(categoryId)
          },
          UpdateExpression: "SET #name = :name, updatedAt = :updatedAt",
          ExpressionAttributeNames: {
            "#name": "name"
          },
          ExpressionAttributeValues: {
            ":name": name,
            ":updatedAt": updatedAt
          },
          ReturnValues: "ALL_NEW"
        })
      );

      return result.Attributes as CategoryItem | undefined;
    },

    async deleteById(userId, categoryId) {
      await documentClient.send(
        new DeleteCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: userPk(userId),
            SK: categorySk(categoryId)
          }
        })
      );
    }
  };
};

export const buildCustomCategoryItem = (
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
  type: "CUSTOM",
  createdAt: now,
  updatedAt: now
});
