import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $filters: UserFilters) {
    users(limit: $limit, offset: $offset, filters: $filters) {
      data {
        id
        name
        email
        role
        status
        createdAt
      }
      total
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
      role
      status
      createdAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;
