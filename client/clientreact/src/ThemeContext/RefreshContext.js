import { createContext, useContext } from "react";
import { useState } from "react";

export const RefreshContext = createContext();
export const Refresh = () => useContext(RefreshContext);

function RefreshProvider({ children }) {
  const [refresh, setRefresh] = useState(false);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export default RefreshProvider;
