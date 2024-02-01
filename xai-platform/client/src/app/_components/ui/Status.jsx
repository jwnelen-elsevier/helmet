"use client";

import { useStatus } from "@/providers/status";

export const StatusIndicator = () => {
  const { isConnected, isLoading } = useStatus();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>{isConnected ? "Connected" : "Disconnected"}</p>
    </div>
  );
};

export default StatusIndicator;
