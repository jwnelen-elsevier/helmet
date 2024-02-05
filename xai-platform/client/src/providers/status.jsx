"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchStatus } from "@/api/status";

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
