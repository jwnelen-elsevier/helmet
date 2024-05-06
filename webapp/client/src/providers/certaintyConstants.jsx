"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  highCertainty as highDefault,
  lowCertainty as lowDefault,
} from "utils/constants";

export const CertaintyConstantsContext = createContext(null);

export const useCertaintyConstants = () =>
  useContext(CertaintyConstantsContext);

export const CertaintyConstantsProvider = ({ children }) => {
  const [lowCertainty, setLowCertainty] = useState(lowDefault);
  const [highCertainty, setHighCertainty] = useState(highDefault);

  useEffect(() => {
    localStorage.setItem("lowCertainty", lowCertainty);
    localStorage.setItem("highCertainty", highCertainty);
  }, [lowCertainty, highCertainty]);

  useEffect(() => {
    const low = localStorage.getItem("lowCertainty");
    const high = localStorage.getItem("highCertainty");

    if (low) {
      setLowCertainty(parseFloat(low));
    }
    if (high) {
      setHighCertainty(parseFloat(high));
    }
  }, []);

  return (
    <CertaintyConstantsContext.Provider
      value={{
        lowCertainty,
        highCertainty,
        setLowCertainty,
        setHighCertainty,
      }}
    >
      {children}
    </CertaintyConstantsContext.Provider>
  );
};
