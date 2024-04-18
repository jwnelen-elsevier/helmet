"use client";

import { fetchStatus } from "app/actions/actions";
import { createContext, useContext, useEffect, useState } from "react";

const StatusContext = createContext();

export const useStatus = () => useContext(StatusContext);

export const StatusProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState();

  useEffect(() => {
    const check = async () => {
      const r = await fetchStatus();
      setIsConnected(r);
    };

    if (!!isConnected) return;
    check();
  }, [isConnected]);

  return (
    <StatusContext.Provider value={{ isConnected }}>
      {children}
    </StatusContext.Provider>
  );
};
