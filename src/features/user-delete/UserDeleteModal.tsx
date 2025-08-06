import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import type { User } from "@entities/user";
import { DELETE_USER, useUserStore } from "@entities/user";
import { MESSAGES } from "@shared/config/constants";
import { Modal, notification } from "antd";
import React from "react";

interface UserDeleteModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  user,
  open,
  onClose,
}) => {
  const { removeUser } = useUserStore();
  const [deleteUser, { loading }] = useMutation(DELETE_USER);

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser({
        variables: { id: user.id },
      });

      removeUser(user.id);
      notification.success({
        message: MESSAGES.USER_DELETED,
      });

      onClose();
    } catch (error) {
      notification.error({
        message: MESSAGES.ERROR_GENERIC,
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <Modal
      title="Delete User"
      open={open}
      onOk={handleDelete}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Delete"
      okType="danger"
      width={400}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: 22 }} />
        <div>
          <p style={{ margin: 0, fontWeight: 500 }}>
            {MESSAGES.CONFIRM_DELETE}
          </p>
          {user && (
            <p style={{ margin: "8px 0 0 0", color: "#666" }}>
              <strong>{user.name}</strong> ({user.email})
            </p>
          )}
          <p style={{ margin: "4px 0 0 0", color: "#999", fontSize: "12px" }}>
            This action cannot be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
};
