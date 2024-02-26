"use client";

import { createContext, useContext, useEffect, useState } from "react";

const StatusContext = createContext({
  isConnected: true,
});

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  const fetchStatus = async () => {
    console.log("fetching status");
    const res = await fetch("/api/status", { cache: "no-store" });
    setIsConnected(res.ok);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <StatusContext.Provider value={{ isConnected }}>
      {children}
    </StatusContext.Provider>
  );
};
