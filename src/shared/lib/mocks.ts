import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilters,
} from "@entities/user";
import { graphql, HttpResponse } from "msw";

interface GetUsersVariables {
  limit?: number;
  offset?: number;
  filters?: UserFilters;
}

interface CreateUserVariables {
  input: CreateUserInput;
}

interface UpdateUserVariables {
  input: UpdateUserInput;
}

interface DeleteUserVariables {
  id: string;
}

interface UpdateUserRoleVariables {
  id: string;
  role: string;
}

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "moderator",
    status: "active",
    createdAt: "2024-02-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "user",
    status: "pending",
    createdAt: "2024-03-10T09:45:00Z",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    role: "user",
    status: "banned",
    createdAt: "2024-01-25T16:20:00Z",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    role: "moderator",
    status: "active",
    createdAt: "2024-03-05T11:10:00Z",
  },
];

export const handlers = [
  // Get users query
  graphql.query("GetUsers", ({ variables }) => {
    const {
      limit = 20,
      offset = 0,
      filters = {},
    } = variables as GetUsersVariables;

    let filteredUsers = [...users];

    // Apply filters
    if (filters.email) {
      filteredUsers = filteredUsers.filter((user: User) =>
        user.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }

    if (filters.role) {
      filteredUsers = filteredUsers.filter(
        (user: User) => user.role === filters.role
      );
    }

    // Apply pagination
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return HttpResponse.json({
      data: {
        users: {
          data: paginatedUsers,
          total: filteredUsers.length,
        },
      },
    });
  }),

  // Create user mutation
  graphql.mutation("CreateUser", ({ variables }) => {
    const { input } = variables as CreateUserVariables;

    const newId = String(users.length + 1);
    const newUser: User = {
      id: newId,
      ...input,
      createdAt: new Date().toISOString(),
    };

    users.unshift(newUser);

    return HttpResponse.json({
      data: {
        createUser: newUser,
      },
    });
  }),

  // Update user mutation
  graphql.mutation("UpdateUser", ({ variables }) => {
    const { input } = variables as UpdateUserVariables;

    const userIndex = users.findIndex((user: User) => user.id === input.id);
    if (userIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: "User not found" }],
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      ...input,
    };

    return HttpResponse.json({
      data: {
        updateUser: users[userIndex],
      },
    });
  }),

  // Delete user mutation
  graphql.mutation("DeleteUser", ({ variables }) => {
    const { id } = variables as DeleteUserVariables;

    const userIndex = users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: "User not found" }],
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    return HttpResponse.json({
      data: {
        deleteUser: { id: deletedUser.id },
      },
    });
  }),

  // Update user role mutation
  graphql.mutation("UpdateUserRole", ({ variables }) => {
    const { id, role } = variables as UpdateUserRoleVariables;

    const userIndex = users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: "User not found" }],
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      role: role as User["role"],
    };

    return HttpResponse.json({
      data: {
        updateUserRole: {
          id: users[userIndex].id,
          role: users[userIndex].role,
        },
      },
    });
  }),
];
