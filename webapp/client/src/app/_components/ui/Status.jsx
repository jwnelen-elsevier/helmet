"use client";

import { useStatus } from "@/providers/status";
import clsx from "clsx";

export const StatusIndicator = () => {
  const { isConnected, isLoading } = useStatus();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return (
    <span
      className={clsx(
        "m-1 rounded-full inline-block w-3 h-3",
        isConnected ? "bg-green-500" : "bg-red-500"
      )}
    ></span>
  );
};

export default StatusIndicator;
