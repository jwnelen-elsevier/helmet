"use client";

import clsx from "clsx";
import { useStatus } from "providers/status";

export const StatusIndicator = () => {
  const { isConnected } = useStatus();

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
