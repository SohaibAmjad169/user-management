import type { UserRole, UserStatus } from "@entities/user";

export const USER_ROLES: UserRole[] = ["admin", "moderator", "user"];

export const USER_STATUSES: UserStatus[] = ["active", "pending", "banned"];

export const DEFAULT_PAGE_SIZE = 20;

export const API_ENDPOINTS = {
  GRAPHQL: "/graphql",
};

export const MESSAGES = {
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  ROLE_UPDATED: "User role updated successfully",
  ERROR_GENERIC: "An error occurred. Please try again.",
  CONFIRM_DELETE: "Are you sure you want to delete this user?",
};
