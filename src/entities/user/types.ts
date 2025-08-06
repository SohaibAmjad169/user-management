export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export type UserRole = "admin" | "user" | "moderator";
export type UserStatus = "active" | "banned" | "pending";

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserInput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserFilters {
  email?: string;
  role?: UserRole;
}

export interface UserTableState {
  users: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
