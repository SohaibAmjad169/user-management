import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1890ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: 6,
    controlHeight: 32,
  },
  components: {
    Button: {
      borderRadius: 6,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
    Modal: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
      headerBg: "#fafafa",
    },
    Card: {
      borderRadius: 8,
    },
  },
};
