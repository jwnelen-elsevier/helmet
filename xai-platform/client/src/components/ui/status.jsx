"use client";

// xai-platform/client/src/components/providers/socket-provider.js
import { useSocket } from "@/components/providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div className="socket-indicator">
      <p>Socket: {isConnected ? "Connected" : "Disconnected"}</p>
    </div>
  );
};

export default SocketIndicator;
