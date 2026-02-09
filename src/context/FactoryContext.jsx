import { createContext, useContext, useState } from "react";

const FactoryContext = createContext();

export function FactoryProvider({ children }) {
  const [factory, setFactory] = useState("");

  return (
    <FactoryContext.Provider value={{ factory, setFactory }}>
      {children}
    </FactoryContext.Provider>
  );
}

export const useFactory = () => useContext(FactoryContext);
