import {
  CrownOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { UserRole } from "@entities/user";
import { Select, Space } from "antd";
import React from "react";

interface RoleCellProps {
  role: UserRole;
  userId: string;
  onRoleChange?: (userId: string, newRole: UserRole) => void;
  readonly?: boolean;
}

const roleConfig = {
  admin: { icon: <CrownOutlined />, text: "Admin", color: "#ff7875" },
  moderator: { icon: <SettingOutlined />, text: "Moderator", color: "#40a9ff" },
  user: { icon: <UserOutlined />, text: "User", color: "#95de64" },
};

export const RoleCell: React.FC<RoleCellProps> = ({
  role,
  userId,
  onRoleChange,
  readonly = false,
}) => {
  const config = roleConfig[role];

  if (readonly) {
    return (
      <Space>
        <span style={{ color: config.color }}>{config.icon}</span>
        <span>{config.text}</span>
      </Space>
    );
  }

  return (
    <Select
      value={role}
      style={{ width: 120 }}
      size="small"
      variant="borderless"
      onChange={(newRole: UserRole) => onRoleChange?.(userId, newRole)}
    >
      {Object.entries(roleConfig).map(([key, { icon, text, color }]) => (
        <Select.Option key={key} value={key}>
          <Space>
            <span style={{ color }}>{icon}</span>
            <span>{text}</span>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
};
