import type { UserStatus } from "@entities/user";
import { Tag } from "antd";
import React from "react";

interface StatusTagProps {
  status: UserStatus;
}

const statusConfig = {
  active: { color: "green", text: "Active" },
  banned: { color: "red", text: "Banned" },
  pending: { color: "orange", text: "Pending" },
};

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Tag color={config.color}>{config.text}</Tag>;
};
