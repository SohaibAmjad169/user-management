import { antdTheme } from "@shared/config/theme";
import { ConfigProvider } from "antd";
import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
};
