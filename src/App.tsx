import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { FrontendAdminProvider } from "@/contexts/FrontendAdminContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteContentProvider } from "@/hooks/useSiteContent";

import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminImages from "./pages/AdminImages";
import { AdminRoute } from "./components/AdminRoute";

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="app-theme">
    <AuthProvider>
      <SiteContentProvider>
      <FrontendAdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/images"
                element={
                  <AdminRoute>
                    <AdminImages />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FrontendAdminProvider>
      </SiteContentProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
