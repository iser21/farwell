import { createContext, useContext, useState, useCallback } from "react";

interface FrontendAdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const FrontendAdminContext = createContext<FrontendAdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export const useFrontendAdmin = () => useContext(FrontendAdminContext);

const ADMIN_EMAIL = "223j1a4651@raghuinstech.com";
const ADMIN_PASSWORD = "Admin@123";

export function FrontendAdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("farewell_admin") === "true";
  });

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem("farewell_admin", "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    sessionStorage.removeItem("farewell_admin");
  }, []);

  return (
    <FrontendAdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </FrontendAdminContext.Provider>
  );
}
