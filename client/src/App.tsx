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
    <>
      <Routes>
      <Route element={<MainLayout displayNavbar={true} displayFooter={true} />}>
        <Route path="/" element={<Profile />} />
        <Route path="/browse" element={<BrowseDestinations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings/profile" element={<EditProfile />} />
      </Route>
      <Route element={<MainLayout displayNavbar={true} displayFooter={false} />}>
        <Route path="/create-trip" element={<CreateTrip />} />
      </Route>
      <Route element={<MainLayout displayNavbar={false} displayFooter={false} />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
      </Route>
    </Routes>
    </>
  );
}

// ctfd_0ffa130568d34b69d9461fd67e422ef6f8e790fefb42dacabacb7266c4a21f72

export default App;
