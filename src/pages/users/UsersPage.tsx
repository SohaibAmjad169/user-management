"use client";

import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_USERS,
  UPDATE_USER_ROLE,
  useUserStore,
  type User,
  type UserRole,
} from "@entities/user";
import { UserDeleteModal } from "@features/user-delete";
import { UserFormModal } from "@features/user-form";
import { MESSAGES, USER_ROLES } from "@shared/config/constants";
import { ActionCell, DateCell, RoleCell, StatusTag } from "@shared/ui";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Card,
  Col,
  Input,
  notification,
  Row,
  Select,
  Space,
  Statistic,
  Typography,
  Divider,
  Badge,
  Tooltip,
  Spin,
  Empty,
  Avatar,
} from "antd";
import type React from "react";
import { useCallback, useMemo, useState } from "react";

const { Title, Text } = Typography;

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export const UsersPage: React.FC = () => {
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [emailFilter, setEmailFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>();

  const { users, filters, pagination, setUsers, setFilters, updateUser } =
    useUserStore();

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE);

  // Fetch users with filters
  const { refetch, loading: queryLoading } = useQuery(GET_USERS, {
    variables: {
      limit: pagination.pageSize,
      offset: (pagination.page - 1) * pagination.pageSize,
      filters,
    },
    onCompleted: (data) => {
      console.log("GraphQL data received:", data);
      setUsers(data.users.data, data.users.total);
    },
    onError: (error) => {
      console.error("GraphQL error:", error);
      notification.error({
        message: "Failed to load users",
        description: error.message,
      });
    },
  });

  // Use Apollo's loading state instead of Zustand loading state
  const isLoading = queryLoading;

  // Calculate statistics
  const stats = useMemo(() => {
    const activeUsers = users.filter((user) => user.status === "active").length;
    const adminUsers = users.filter((user) => user.role === "admin").length;
    const totalUsers = users.length;

    return {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      inactive: totalUsers - activeUsers,
    };
  }, [users]);

  // Handle role change in grid
  const handleRoleChange = useCallback(
    async (userId: string, newRole: UserRole) => {
      try {
        const { data } = await updateUserRole({
          variables: { id: userId, role: newRole },
        });
        if (data?.updateUserRole) {
          const updatedUser = users.find((u) => u.id === userId);
          if (updatedUser) {
            updateUser({ ...updatedUser, role: newRole });
          }
          notification.success({
            message: MESSAGES.ROLE_UPDATED,
          });
        }
      } catch (error) {
        notification.error({
          message: MESSAGES.ERROR_GENERIC,
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [updateUserRole, users, updateUser]
  );

  // Column definitions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "ID",
        field: "id",
        width: 80,
        minWidth: 70,
        maxWidth: 100,
        sortable: true,
      },
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        minWidth: 150,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Email",
        field: "email",
        flex: 2,
        minWidth: 200,
        sortable: true,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Role",
        field: "role",
        width: 130,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => (
          <RoleCell
            role={params.value}
            userId={params.data.id}
            onRoleChange={handleRoleChange}
          />
        ),
      },
      {
        headerName: "Status",
        field: "status",
        width: 100,
        minWidth: 90,
        cellRenderer: (params: ICellRendererParams) => (
          <StatusTag status={params.value} />
        ),
      },
      {
        headerName: "Registration Date",
        field: "createdAt",
        width: 180,
        minWidth: 160,
        sortable: true,
        cellRenderer: (params: ICellRendererParams) => (
          <DateCell date={params.value} />
        ),
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 240,
        minWidth: 220,
        cellRenderer: (params: ICellRendererParams) => (
          <ActionCell
            onEdit={() => handleEdit(params.data)}
            onDelete={() => handleDelete(params.data)}
          />
        ),
        sortable: false,
        filter: false,
      },
    ],
    [handleRoleChange]
  );

  // Event handlers
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...(emailFilter && { email: emailFilter }),
      ...(roleFilter && { role: roleFilter }),
    };
    setFilters(newFilters);
    refetch({
      filters: newFilters,
      limit: pagination.pageSize,
      offset: 0,
    });
  };

  const handleClearFilters = () => {
    setEmailFilter("");
    setRoleFilter(undefined);
    setFilters({});
    refetch({
      filters: {},
      limit: pagination.pageSize,
      offset: 0,
    });
  };

  const hasActiveFilters = emailFilter || roleFilter;

  return (
    <div
      style={{
        padding: "32px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <div style={{ marginBottom: 32 }}>
          <Card
            style={{
              borderRadius: 20,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={4}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <Avatar
                      size={56}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      icon={<UserOutlined style={{ fontSize: 24 }} />}
                    />
                    <div>
                      <Title
                        level={1}
                        style={{
                          margin: 0,
                          color: "#1a202c",
                          fontSize: 32,
                          fontWeight: 700,
                        }}
                      >
                        User Management
                      </Title>
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        Manage and monitor user accounts across your platform
                      </Text>
                    </div>
                  </div>
                </Space>
              </Col>
              <Col>
                <Space size="large">
                  <Tooltip title="Refresh user data" placement="bottom">
                    <Button
                      size="large"
                      icon={<ReloadOutlined />}
                      onClick={handleRefresh}
                      loading={isLoading}
                      style={{
                        borderRadius: 12,
                        height: 48,
                        paddingLeft: 20,
                        paddingRight: 20,
                        border: "2px solid #e2e8f0",
                        background: "white",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(0, 0, 0, 0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.05)";
                      }}
                    >
                      Refresh
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add new user" placement="bottom">
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={handleAddUser}
                      style={{
                        borderRadius: 12,
                        height: 48,
                        paddingLeft: 24,
                        paddingRight: 24,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(102, 126, 234, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 24px rgba(102, 126, 234, 0.4)";
                      }}
                    >
                      Add User
                    </Button>
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "white",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(102, 126, 234, 0.3)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Total Users
                  </span>
                }
                value={stats.total}
                prefix={<TeamOutlined style={{ fontSize: 20 }} />}
                valueStyle={{ color: "white", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                border: "none",
                color: "white",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 12px 32px rgba(240, 147, 251, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(240, 147, 251, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(240, 147, 251, 0.3)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Active Users
                  </span>
                }
                value={stats.active}
                valueStyle={{ color: "white", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                border: "none",
                color: "white",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 12px 32px rgba(79, 172, 254, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(79, 172, 254, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(79, 172, 254, 0.3)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Administrators
                  </span>
                }
                value={stats.admins}
                valueStyle={{ color: "white", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                border: "none",
                color: "white",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 12px 32px rgba(250, 112, 154, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(250, 112, 154, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(250, 112, 154, 0.3)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                }}
              />
              <Statistic
                title={
                  <span
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Inactive Users
                  </span>
                }
                value={stats.inactive}
                valueStyle={{ color: "white", fontWeight: 700, fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card
          style={{
            borderRadius: 20,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Filters Section */}
          <div
            style={{
              padding: "32px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 24 }}
            >
              <Col>
                <Space align="center" size={12}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FilterOutlined style={{ color: "white", fontSize: 18 }} />
                  </div>
                  <div>
                    <Title
                      level={4}
                      style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}
                    >
                      Advanced Filters
                    </Title>
                    <Text style={{ color: "#64748b", fontSize: 14 }}>
                      Refine your search to find specific users
                    </Text>
                  </div>
                  {hasActiveFilters && (
                    <Badge
                      count="Active"
                      style={{
                        backgroundColor: "#10b981",
                        fontSize: 12,
                        height: 22,
                        lineHeight: "22px",
                        borderRadius: 11,
                        fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                      }}
                    />
                  )}
                </Space>
              </Col>
            </Row>

            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} sm={12} md={10}>
                <div style={{ position: "relative" }}>
                  <Input
                    placeholder="Search by email address..."
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    prefix={
                      <SearchOutlined
                        style={{ color: "#9ca3af", fontSize: 16 }}
                      />
                    }
                    allowClear
                    size="large"
                    style={{
                      borderRadius: 12,
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      fontSize: 16,
                      height: 48,
                      background: "white",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(102, 126, 234, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.05)";
                    }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Filter by user role..."
                  value={roleFilter}
                  onChange={setRoleFilter}
                  size="large"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  dropdownStyle={{
                    borderRadius: 12,
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  {USER_ROLES.map((role) => (
                    <Select.Option key={role} value={role}>
                      <Space>
                        <Badge
                          color={
                            role === "admin"
                              ? "#f59e0b"
                              : role === "user"
                              ? "#10b981"
                              : "#6b7280"
                          }
                        />
                        <span style={{ fontWeight: 500 }}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </span>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <Space
                  style={{ width: "100%", justifyContent: "flex-end" }}
                  size={12}
                >
                  <Button
                    type="primary"
                    onClick={handleApplyFilters}
                    icon={<SearchOutlined />}
                    size="large"
                    style={{
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      fontWeight: 600,
                      height: 48,
                      paddingLeft: 20,
                      paddingRight: 20,
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(102, 126, 234, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(102, 126, 234, 0.3)";
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={handleClearFilters}
                    icon={<ClearOutlined />}
                    size="large"
                    disabled={!hasActiveFilters}
                    style={{
                      borderRadius: 12,
                      height: 48,
                      paddingLeft: 20,
                      paddingRight: 20,
                      fontWeight: 600,
                      border: "2px solid #e2e8f0",
                      background: "white",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!(e.currentTarget as HTMLButtonElement).disabled) {
                        e.currentTarget.style.borderColor = "#f87171";
                        e.currentTarget.style.color = "#f87171";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!(e.currentTarget as HTMLButtonElement).disabled) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.color = "";
                      }
                    }}
                  >
                    Clear
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: 0 }} />

          {/* Data Grid Section */}
          <div style={{ padding: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <Title
                level={4}
                style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}
              >
                User Directory
              </Title>
              <Text style={{ color: "#64748b", fontSize: 14 }}>
                {users.length} {users.length === 1 ? "user" : "users"} found
              </Text>
            </div>

            <Spin spinning={isLoading} size="large">
              <div
                style={{
                  height: 600,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 16,
                  border: "2px solid #f1f5f9",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                }}
              >
                {users.length === 0 && !isLoading ? (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    }}
                  >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      imageStyle={{
                        height: 120,
                        marginBottom: 24,
                      }}
                      description={
                        <Space
                          direction="vertical"
                          size="small"
                          style={{ textAlign: "center" }}
                        >
                          <Title
                            level={4}
                            style={{ color: "#64748b", fontWeight: 600 }}
                          >
                            No users found
                          </Title>
                          <Text style={{ color: "#94a3b8", fontSize: 16 }}>
                            {hasActiveFilters
                              ? "Try adjusting your filters or add some users to get started"
                              : "Add your first user to get started with user management"}
                          </Text>
                        </Space>
                      }
                    >
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddUser}
                        size="large"
                        style={{
                          borderRadius: 12,
                          height: 48,
                          paddingLeft: 24,
                          paddingRight: 24,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          fontWeight: 600,
                          fontSize: 16,
                          boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        Add First User
                      </Button>
                    </Empty>
                  </div>
                ) : (
                  <AgGridReact
                    theme={themeQuartz}
                    columnDefs={columnDefs}
                    rowData={users}
                    pagination={true}
                    paginationPageSize={pagination.pageSize}
                    loading={isLoading}
                    suppressCellFocus={true}
                    rowHeight={64}
                    headerHeight={64}
                    defaultColDef={{
                      resizable: true,
                      sortable: false,
                      filter: false,
                    }}
                    rowStyle={{
                      borderBottom: "1px solid #f1f5f9",
                      fontSize: 14,
                    }}
                    getRowStyle={(params) => {
                      if (
                        params.node.rowIndex !== null &&
                        params.node.rowIndex % 2 === 0
                      ) {
                        return {
                          backgroundColor: "#fafbfc",
                          transition: "all 0.2s ease",
                        };
                      }
                      return {
                        backgroundColor: "white",
                        transition: "all 0.2s ease",
                      };
                    }}
                  />
                )}
              </div>
            </Spin>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <UserFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
      <UserDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};
