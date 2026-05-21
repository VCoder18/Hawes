import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router";
import ErrorPageWrapper from "@/pages/ErrorPageWrapper";
import Profile from "@/pages/Profile";
import BrowseDestinations from "@/pages/BrowseDestinations";
import BrowseTrips from "@/pages/BrowseTrips";
import CreateTrip from "@/pages/CreateTrip";
import MainLayout from "@/layouts/MainLayout";
import EditProfile from "@/pages/settings/EditProfile";
import LoginForm from "@/pages/LoginForm";
import SignupForm from "@/pages/SignupForm";
import { AuthProvider } from "@/contexts/AuthContext";
import { TripProvider } from "@/contexts/TripContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import JoinTrip from "@/pages/JoinTrip";
import JoinTripForm from "@/pages/JoinTripForm";
import { Toaster } from "@/components/Toaster";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <AuthProvider>
        <TripProvider>
          <Routes>
            <Route element={<MainLayout displayNavbar={true} displayFooter={true} />}>
              <Route path="/" element={<Profile />} />
              <Route path="/browse" element={<BrowseDestinations />} />
              <Route path="/trips" element={<BrowseTrips />} />
              <Route path="/trips/:id" element={<JoinTrip />} />
              <Route path="/trips/:id/book" element={<JoinTripForm />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            </Route>
            <Route element={<MainLayout displayNavbar={true} displayFooter={false} />}>
              <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
            </Route>
            <Route element={<MainLayout displayNavbar={false} displayFooter={false} />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<SignupForm />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<ErrorPageWrapper />} />
          </Routes>
        </TripProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;
