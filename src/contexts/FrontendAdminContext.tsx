import { createContext, useContext } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export function FrontendAdminProvider({ children }: { children: React.ReactNode }) {
  // Delegate to real Supabase auth — no hardcoded credentials
  const { isAdmin, signOut } = useAuth();

  const login = (_email: string, _password: string) => {
    // Frontend admin login is no longer supported via hardcoded credentials.
    // Users should log in via /admin which uses Supabase Auth.
    return false;
  };

  const logout = () => {
    signOut();
  };

  return (
    <FrontendAdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </FrontendAdminContext.Provider>
  );
}
