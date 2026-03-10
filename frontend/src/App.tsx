import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/app/auth/ProtectedRoute'
import { AdminRoute } from '@/app/admin/AdminRoute'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { Dashboard } from '@/pages/Dashboard'
import { CreateBiodata } from '@/pages/CreateBiodata'
import { MyBiodata } from '@/pages/MyBiodata'
import { TemplatesPage } from '@/pages/TemplatesPage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { PremiumPage } from '@/pages/PremiumPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/create" element={<CreateBiodata />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/create" element={<CreateBiodata />} />
        <Route path="/app/edit/:id" element={<CreateBiodata />} />
        <Route path="/app/my" element={<MyBiodata />} />
        <Route path="/app/templates" element={<TemplatesPage />} />
        <Route path="/app/settings" element={<SettingsPage />} />
        <Route path="/app/premium" element={<PremiumPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/app/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
