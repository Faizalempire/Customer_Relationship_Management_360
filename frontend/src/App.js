import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Toaster } from "./components/ui/sonner";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import Pipeline from "./pages/Pipeline";
import Tasks from "./pages/Tasks";
import FollowUps from "./pages/FollowUps";
import CalendarPage from "./pages/CalendarPage";
import Team from "./pages/Team";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import ActivityLogs from "./pages/ActivityLogs";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function Protected({ children, allow }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Protected><DashboardLayout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="customers" element={<Customers />} />
            <Route path="pipeline" element={<Protected allow={["admin","sales_manager"]}><Pipeline /></Protected>} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="followups" element={<FollowUps />} />
            <Route path="calendar" element={<Protected allow={["admin"]}><CalendarPage /></Protected>} />
            <Route path="team" element={<Protected allow={["admin","sales_manager"]}><Team /></Protected>} />
            <Route path="users" element={<Protected allow={["admin"]}><UserManagement /></Protected>} />
            <Route path="reports" element={<Protected allow={["admin","sales_manager"]}><Reports /></Protected>} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="activity" element={<Protected allow={["admin"]}><ActivityLogs /></Protected>} />
            <Route path="settings" element={<Protected allow={["admin"]}><Settings /></Protected>} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster theme="dark" position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
