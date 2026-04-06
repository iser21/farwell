import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader } from "@/components/Loader";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
}
