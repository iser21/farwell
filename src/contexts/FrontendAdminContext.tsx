import { createContext, useContext, useState, useCallback } from "react";

interface FrontendAdminContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_EMAIL = "223j1a4651@raghuinstech.com";
const ADMIN_PASSWORD = "Admin@123";

const FrontendAdminContext = createContext<FrontendAdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export const useFrontendAdmin = () => useContext(FrontendAdminContext);

export function FrontendAdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem("farewell-admin") === "true";
    } catch {
      return false;
    }
  });

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("farewell-admin", "true");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem("farewell-admin");
  }, []);

  return (
    <FrontendAdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </FrontendAdminContext.Provider>
  );
}
