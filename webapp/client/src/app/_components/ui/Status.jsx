"use client";

// import { useStatus } from "@/providers/status";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const StatusIndicator = () => {
  // const { isConnected } = useStatus();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("useEffect, fetching status");
    fetchStatus();
  }, []);

  async function fetchStatus() {
    console.log("fetching status");
    const res = await fetch("/api/status", {
      cache: "no-store",
    });
    setIsConnected(res.ok);
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
