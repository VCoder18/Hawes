import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router";
import Profile from "@/pages/Profile";
import BrowseDestinations from "@/pages/BrowseDestinations";
import CreateTrip from "@/pages/CreateTrip";
import MainLayout from "@/layouts/MainLayout";
import EditProfile from "@/pages/settings/EditProfile";
import LoginForm from "@/pages/LoginForm";
import SignupForm from "@/pages/SignupForm";
import { AuthProvider } from "@/contexts/AuthContext";
import { TripProvider } from "@/contexts/TripContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthCallback } from "@/pages/AuthCallback";
import Dashbord from "./components/Dashbord";
import Errorpage from "./components/Errorpage";
import BusinessOverview from "./components/BusinessOverview";
import Servicesrating from "./components/Servicesrating";

// TODO:
// - add Images
// - fix form (height and visibility)
// - add input requirements 

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <TripProvider>
      <Routes>
      <Route element={<MainLayout displayNavbar={true} displayFooter={true} />}>
        <Route path="/" element={<Profile />} />
        <Route path="/browse" element={<BrowseDestinations />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/settings/profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Route>
      <Route element={<MainLayout displayNavbar={true} displayFooter={false} />}>
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
      <Route path="/Servicesrating" element={<Servicesrating />} />
      </Route>
      <Route element={<MainLayout displayNavbar={false} displayFooter={false} />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/business" element={<BusinessOverview  />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashbord" element={<Dashbord />} />
        
      </Route>
      <Route path="*" element={<Errorpage />} />
    </Routes>
    </TripProvider>
    </AuthProvider>
  );
}

export default App;
