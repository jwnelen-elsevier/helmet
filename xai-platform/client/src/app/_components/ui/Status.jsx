"use client";

import { useStatus } from "@/providers/status";

export const StatusIndicator = () => {
  const { isConnected, isLoading } = useStatus();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <p>
      Connected to NodeJS:{" "}
      <span className={isConnected ? "text-green-500" : "text-red-500"}>
        {isConnected ? "Yes" : "No"}
      </span>
    </p>
  );
};

export default StatusIndicator;
