import { create } from "zustand";
import type { User, UserFilters, UserTableState } from "./types";

interface UserStore extends UserTableState {
  // Actions
  setUsers: (users: User[], total?: number) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: UserFilters) => void;
  setPagination: (page: number, pageSize?: number) => void;
  clearFilters: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // Initial state
  users: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },

  // Actions
  setUsers: (users: User[], total?: number) =>
    set((state) => ({
      users,
      pagination: {
        ...state.pagination,
        total: total ?? users.length,
      },
    })),

  addUser: (user: User) =>
    set((state) => ({
      users: [user, ...state.users],
      pagination: {
        ...state.pagination,
        total: state.pagination.total + 1,
      },
    })),

  updateUser: (updatedUser: User) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      ),
    })),

  removeUser: (id: string) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      pagination: {
        ...state.pagination,
        total: state.pagination.total - 1,
      },
    })),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  setFilters: (filters: UserFilters) => set({ filters }),

  setPagination: (page: number, pageSize?: number) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
        ...(pageSize && { pageSize }),
      },
    })),

  clearFilters: () => set({ filters: {} }),
}));
