import { formatDate, formatISODate } from "@shared/lib/date";
import { Tooltip } from "antd";
import React from "react";

interface DateCellProps {
  date: string;
}

export const DateCell: React.FC<DateCellProps> = ({ date }) => {
  return (
    <Tooltip title={formatISODate(date)}>
      <span>{formatDate(date)}</span>
    </Tooltip>
  );
};
