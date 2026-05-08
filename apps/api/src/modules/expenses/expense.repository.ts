import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { getDocumentClient } from "../../shared/db";
import type { ExpenseItem } from "../../shared/db";
import {
  expenseSk,
  expenseSkFromDate,
  expenseSkPrefix,
  expenseSkToDate,
  userPk
} from "../../shared/db";
import { getEnv } from "../../shared/env";

export type ExpenseUpdateValues = Partial<
  Pick<ExpenseItem, "amount" | "description" | "categoryId" | "date">
>;

export type ExpenseRepository = {
  listByUserId: (
    userId: string,
    filters: {
      from?: string;
      to?: string;
      categoryId?: string;
    }
  ) => Promise<ExpenseItem[]>;
  findById: (
    userId: string,
    expenseId: string
  ) => Promise<ExpenseItem | undefined>;
  create: (expense: ExpenseItem) => Promise<void>;
  update: (
    existingExpense: ExpenseItem,
    values: ExpenseUpdateValues,
    updatedAt: string
  ) => Promise<ExpenseItem | undefined>;
  deleteById: (expense: ExpenseItem) => Promise<void>;
};

export const createExpenseRepository = (): ExpenseRepository => {
  const documentClient = getDocumentClient();
  const env = getEnv();

  return {
    async listByUserId(userId, filters) {
      const hasDateRange = Boolean(filters.from && filters.to);
      const keyConditionExpression = hasDateRange
        ? "PK = :pk AND SK BETWEEN :fromSk AND :toSk"
        : "PK = :pk AND begins_with(SK, :skPrefix)";
      const expressionAttributeValues: Record<string, string> = hasDateRange
        ? {
            ":pk": userPk(userId),
            ":fromSk": expenseSkFromDate(filters.from as string),
            ":toSk": expenseSkToDate(filters.to as string)
          }
        : {
            ":pk": userPk(userId),
            ":skPrefix": expenseSkPrefix()
          };

      const result = await documentClient.send(
        new QueryCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          KeyConditionExpression: keyConditionExpression,
          ExpressionAttributeValues: expressionAttributeValues
        })
      );
      const items = (result.Items ?? []) as ExpenseItem[];

      if (!filters.categoryId) {
        return items;
      }

      return items.filter((item) => item.categoryId === filters.categoryId);
    },

    async findById(userId, expenseId) {
      const result = await documentClient.send(
        new QueryCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
          ExpressionAttributeValues: {
            ":pk": userPk(userId),
            ":skPrefix": expenseSkPrefix()
          }
        })
      );

      return ((result.Items ?? []) as ExpenseItem[]).find(
        (item) => item.expenseId === expenseId
      );
    },

    async create(expense) {
      await documentClient.send(
        new PutCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Item: expense,
          ConditionExpression: "attribute_not_exists(PK)"
        })
      );
    },

    async update(existingExpense, values, updatedAt) {
      const nextExpense = {
        ...existingExpense,
        ...values,
        updatedAt
      };
      const dateChanged = values.date && values.date !== existingExpense.date;

      if (dateChanged) {
        await documentClient.send(
          new DeleteCommand({
            TableName: env.DYNAMODB_TABLE_NAME,
            Key: {
              PK: existingExpense.PK,
              SK: existingExpense.SK
            }
          })
        );

        nextExpense.SK = expenseSk(nextExpense.date, nextExpense.expenseId);

        await documentClient.send(
          new PutCommand({
            TableName: env.DYNAMODB_TABLE_NAME,
            Item: nextExpense,
            ConditionExpression: "attribute_not_exists(PK)"
          })
        );

        return nextExpense;
      }

      const result = await documentClient.send(
        new UpdateCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: existingExpense.PK,
            SK: existingExpense.SK
          },
          UpdateExpression:
            "SET amount = :amount, description = :description, categoryId = :categoryId, updatedAt = :updatedAt",
          ExpressionAttributeValues: {
            ":amount": nextExpense.amount,
            ":description": nextExpense.description,
            ":categoryId": nextExpense.categoryId,
            ":updatedAt": updatedAt
          },
          ReturnValues: "ALL_NEW"
        })
      );

      return result.Attributes as ExpenseItem | undefined;
    },

    async deleteById(expense) {
      await documentClient.send(
        new DeleteCommand({
          TableName: env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: expense.PK,
            SK: expense.SK
          }
        })
      );
    }
  };
};

export const buildExpenseItem = (
  params: {
    userId: string;
    expenseId: string;
    amount: number;
    description: string;
    categoryId: string;
    date: string;
  },
  now: string
): ExpenseItem => ({
  PK: userPk(params.userId),
  SK: expenseSk(params.date, params.expenseId),
  entityType: "EXPENSE",
  expenseId: params.expenseId,
  userId: params.userId,
  amount: params.amount,
  description: params.description,
  categoryId: params.categoryId,
  date: params.date,
  createdAt: now,
  updatedAt: now
});
