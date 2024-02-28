"use client";

import { fetchStatus } from "@/api/status";
import { createContext, useContext, useEffect, useState } from "react";

const StatusContext = createContext({
  isConnected: true,
  isLoading: true,
});

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatus().then((status) => {
      setIsConnected(status);
      setIsLoading(false);
    });
  }, []);

  return (
    <StatusContext.Provider value={{ isConnected, isLoading }}>
      {children}
    </StatusContext.Provider>
  );
};
