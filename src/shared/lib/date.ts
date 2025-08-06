import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: string): string => {
  return dayjs(date).format("DD.MM.YYYY, HH:mm");
};

export const formatISODate = (date: string): string => {
  return dayjs(date).toISOString();
};

export const getRelativeTime = (date: string): string => {
  return dayjs(date).fromNow();
};
