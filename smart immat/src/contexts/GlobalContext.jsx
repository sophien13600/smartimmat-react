import { useState } from "react";
import { GlobalContext } from "./globalContext";

export const Provider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    false || localStorage.getItem("email")
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};