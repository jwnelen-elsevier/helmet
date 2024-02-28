"use client";

import { fetchStatus } from "@/app/actions/actions";
import { createContext, useContext, useEffect, useState } from "react";

const StatusContext = createContext({
  isConnected: true,
});

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const r = fetchStatus();
    setIsConnected(r);
  }, []);

  return (
    <StatusContext.Provider value={{ isConnected }}>
      {children}
    </StatusContext.Provider>
  );
};
