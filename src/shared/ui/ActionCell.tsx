import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";

interface ActionCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionCell: React.FC<ActionCellProps> = ({ onEdit, onDelete }) => {
  return (
    <Space size="small">
      <Button
        type="text"
        size="small"
        icon={<EditOutlined />}
        onClick={onEdit}
        style={{ color: "#1890ff" }}
      >
        Edit
      </Button>
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={onDelete}
        style={{ color: "#ff4d4f" }}
      >
        Delete
      </Button>
    </Space>
  );
};
