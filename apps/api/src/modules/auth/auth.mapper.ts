import type { AuthUser } from "@expense-tracker/shared";

import type { UserItem } from "../../shared/db";

export const mapUserItemToAuthUser = (item: UserItem): AuthUser => ({
  userId: item.userId,
  name: item.name,
  email: item.email
});
