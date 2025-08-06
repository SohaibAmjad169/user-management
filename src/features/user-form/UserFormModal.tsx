import { useMutation } from "@apollo/client";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRole,
  UserStatus,
} from "@entities/user";
import { CREATE_USER, UPDATE_USER, useUserStore } from "@entities/user";
import { MESSAGES, USER_ROLES, USER_STATUSES } from "@shared/config/constants";
import {
  Form,
  Input,
  Modal,
  Select,
  notification,
  Space,
  Typography,
  Avatar,
  Badge,
} from "antd";
import {
  UserPlus,
  Edit,
  Mail,
  User as UserIcon,
  Shield,
  Activity,
  Check,
  X,
} from "lucide-react";
import React, { useEffect } from "react";

const { Title, Text } = Typography;

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  user,
}) => {
  const [form] = Form.useForm();
  const { addUser, updateUser } = useUserStore();

  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    onCompleted: (data) => {
      addUser(data.createUser);
      notification.success({
        message: MESSAGES.USER_CREATED,
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "none",
          borderRadius: "12px",
          color: "white",
        },
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to create user",
        description: error.message,
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: "none",
          borderRadius: "12px",
          color: "white",
        },
      });
    },
  });

  const [updateUserMutation, { loading: updating }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      updateUser(data.updateUser);
      notification.success({
        message: MESSAGES.USER_UPDATED,
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          border: "none",
          borderRadius: "12px",
          color: "white",
        },
      });
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to update user",
        description: error.message,
        style: {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          border: "none",
          borderRadius: "12px",
          color: "white",
        },
      });
    },
  });

  const isEditing = Boolean(user);
  const loading = creating || updating;

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEditing && user) {
        const input: UpdateUserInput = {
          id: user.id,
          ...values,
        };

        await updateUserMutation({
          variables: { input },
        });
      } else {
        const input: CreateUserInput = values;

        await createUser({
          variables: { input },
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "#f59e0b";
      case "user":
        return "#10b981";
      case "moderator":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10b981";
      case "inactive":
        return "#f59e0b";
      case "suspended":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
      centered
      maskStyle={{
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(8px)",
      }}
      style={{
        top: 0,
      }}
      styles={{
        content: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          borderRadius: 24,
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 2,
          borderRadius: 24,
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
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
            `,
            pointerEvents: "none",
            borderRadius: 24,
          }}
        />

        <div
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderRadius: 22,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header Section */}
          <div
            style={{
              padding: "32px 32px 24px 32px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "22px 22px 0 0",
              borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            }}
          >
            <Space size={16} align="center" style={{ width: "100%" }}>
              <Avatar
                size={64}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                }}
                icon={
                  isEditing ? (
                    <Edit size={28} color="white" />
                  ) : (
                    <UserPlus size={28} color="white" />
                  )
                }
              />
              <div style={{ flex: 1 }}>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    color: "#1e293b",
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {isEditing ? "Edit User Account" : "Create New User"}
                </Title>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {isEditing
                    ? "Update user information and permissions"
                    : "Add a new user to your platform"}
                </Text>
              </div>
            </Space>
          </div>

          {/* Form Section */}
          <div style={{ padding: "32px" }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                status: "active",
                role: "user",
              }}
              size="large"
            >
              {/* Name Field */}
              <Form.Item
                name="name"
                label={
                  <Space size={8} align="center">
                    <UserIcon size={16} color="#667eea" />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Full Name
                    </span>
                  </Space>
                }
                rules={[
                  { required: true, message: "Please enter the user name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
                style={{ marginBottom: 24 }}
              >
                <Input
                  placeholder="Enter full name..."
                  prefix={<UserIcon size={18} color="#9ca3af" />}
                  style={{
                    borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    fontSize: 16,
                    height: 52,
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
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </Form.Item>

              {/* Email Field */}
              <Form.Item
                name="email"
                label={
                  <Space size={8} align="center">
                    <Mail size={16} color="#667eea" />
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      Email Address
                    </span>
                  </Space>
                }
                rules={[
                  { required: true, message: "Please enter the email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
                style={{ marginBottom: 24 }}
              >
                <Input
                  placeholder="Enter email address..."
                  prefix={<Mail size={18} color="#9ca3af" />}
                  style={{
                    borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    fontSize: 16,
                    height: 52,
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
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                />
              </Form.Item>

              {/* Role and Status Row */}
              <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
                {/* Role Field */}
                <Form.Item
                  name="role"
                  label={
                    <Space size={8} align="center">
                      <Shield size={16} color="#667eea" />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        User Role
                      </span>
                    </Space>
                  }
                  rules={[{ required: true, message: "Please select a role" }]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Select
                    placeholder="Select user role..."
                    style={{
                      borderRadius: 12,
                    }}
                    dropdownStyle={{
                      borderRadius: 12,
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    {USER_ROLES.map((role: UserRole) => (
                      <Select.Option key={role} value={role}>
                        <Space align="center">
                          <Badge color={getRoleColor(role)} />
                          <span style={{ fontWeight: 500, fontSize: 15 }}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </span>
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Status Field */}
                <Form.Item
                  name="status"
                  label={
                    <Space size={8} align="center">
                      <Activity size={16} color="#667eea" />
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Account Status
                      </span>
                    </Space>
                  }
                  rules={[
                    { required: true, message: "Please select a status" },
                  ]}
                  style={{ flex: 1, marginBottom: 0 }}
                >
                  <Select
                    placeholder="Select account status..."
                    style={{
                      borderRadius: 12,
                    }}
                    dropdownStyle={{
                      borderRadius: 12,
                      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                  >
                    {USER_STATUSES.map((status: UserStatus) => (
                      <Select.Option key={status} value={status}>
                        <Space align="center">
                          <Badge color={getStatusColor(status)} />
                          <span style={{ fontWeight: 500, fontSize: 15 }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </Space>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 16,
                  paddingTop: 24,
                  borderTop: "1px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    height: 52,
                    paddingLeft: 24,
                    paddingRight: 24,
                    borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    background: "white",
                    color: "#64748b",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f87171";
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(248, 113, 113, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#64748b";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    height: 52,
                    paddingLeft: 32,
                    paddingRight: 32,
                    borderRadius: 12,
                    border: "none",
                    background: loading
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.3s ease",
                    boxShadow: loading
                      ? "none"
                      : "0 8px 24px rgba(102, 126, 234, 0.4)",
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 32px rgba(102, 126, 234, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(102, 126, 234, 0.4)";
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {isEditing ? "Update User" : "Create User"}
                    </>
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .ant-select-selector {
            border-radius: 12px !important;
            border: 2px solid #e2e8f0 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
            height: 52px !important;
            background: white !important;
            transition: all 0.3s ease !important;
          }
          
          .ant-select-focused .ant-select-selector {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .ant-select-selection-item {
            line-height: 48px !important;
            font-size: 16px !important;
          }
          
          .ant-select-selection-placeholder {
            line-height: 48px !important;
            font-size: 16px !important;
            color: #9ca3af !important;
          }
          
          .ant-form-item-label > label {
            font-size: 16px !important;
            font-weight: 600 !important;
            color: #374151 !important;
            margin-bottom: 8px !important;
          }
          
          .ant-input:focus,
          .ant-input-focused {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          }
          
          .ant-form-item-explain-error {
            font-size: 14px !important;
            color: #ef4444 !important;
            margin-top: 8px !important;
            font-weight: 500 !important;
          }
          
          .ant-form-item-has-error .ant-input,
          .ant-form-item-has-error .ant-select-selector {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
          }
        `}
      </style>
    </Modal>
  );
};
