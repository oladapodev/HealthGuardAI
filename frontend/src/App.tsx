import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import AuthLayout from "@/layouts/AuthLayout"
import AppLayout from "@/layouts/AppLayout"

import WelcomePage       from "@/pages/WelcomePage"
import AuthPage          from "@/pages/AuthPage"
import ProfileSetupPage  from "@/pages/ProfileSetupPage"
import DashboardPage     from "@/pages/DashboardPage"
import UploadPage        from "@/pages/UploadPage"
import CheckInPage       from "@/pages/CheckInPage"
import ReportsPage       from "@/pages/ReportsPage"
import ChatPage          from "@/pages/ChatPage"
import SettingsPage      from "@/pages/SettingsPage"
import PatientResultPage from "@/pages/PatientResultPage"
import MarkerDetailPage  from "@/pages/MarkerDetailPage"
import DoctorNotePage    from "@/pages/DoctorNotePage"
import PDFExportPage     from "@/pages/PDFExportPage"
import TrendsPage        from "@/pages/TrendsPage"
import EnvironmentPage   from "@/pages/EnvironmentPage"
import { route as routeLog } from "@/lib/logger"

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) {
    routeLog.guard(location.pathname, "not authenticated")
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function RequireGuest({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth()
  if (token) {
    const profileDone = user?.profile?.age != null
    const dest = profileDone ? "/dashboard" : "/setup"
    routeLog.redirect("/", dest)
    return <Navigate to={dest} replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Guest-only */}
      <Route element={<AuthLayout />}>
        <Route path="/"     element={<RequireGuest><WelcomePage /></RequireGuest>} />
        <Route path="/auth" element={<RequireGuest><AuthPage /></RequireGuest>} />
      </Route>

      {/* Profile setup */}
      <Route path="/setup" element={<RequireAuth><ProfileSetupPage /></RequireAuth>} />

      {/* Main app shell */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/dashboard"                  element={<DashboardPage />} />
        <Route path="/upload"                     element={<UploadPage />} />
        <Route path="/checkin"                    element={<CheckInPage />} />
        <Route path="/reports"                    element={<ReportsPage />} />
        <Route path="/chat"                       element={<ChatPage />} />
        <Route path="/settings"                   element={<SettingsPage />} />
        <Route path="/trends"                     element={<TrendsPage />} />
        <Route path="/environment"                element={<EnvironmentPage />} />
        <Route path="/results/:id"                element={<PatientResultPage />} />
        <Route path="/results/:id/marker/:marker" element={<MarkerDetailPage />} />
        <Route path="/results/:id/note"           element={<DoctorNotePage />} />
        <Route path="/results/:id/export"         element={<PDFExportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  )
}
