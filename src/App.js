// App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import SignIn from "./pages/SignIn";
import Create from "./pages/Create";
import Profile from "./Components/User-Profile";
import Feed from "./Components/Feed";
import Navbar from "./Components/Navbar";
import Uid from "./Components/Uid";
import Finduser from "./Components/Finduser";
import Createpost from "./Components/Createpost";
import Suggestion from "./Components/Suggest";
import MobileNav from "./Components/MobileNav";

import ProtectedRoute from "./Components/ProtectedRoutes";

// NEW Forgot Password Pages
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";

// ---------------------------
// Layouts
// ---------------------------

const MainLayout = ({ children }) => (
  <div className="container-fluid">
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 mt-3">{children}</div>

      <div className="col-12 col-md-10 col-lg-3 mt-3 d-none d-lg-block">
        <Suggestion />
      </div>
    </div>
  </div>
);

const AuthLayout = ({ children }) => (
  <div
    className="container d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <div className="col-12 col-md-6 col-lg-4">{children}</div>
  </div>
);

// ---------------------------
// MAIN APP
// ---------------------------

const App = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/create" ||
    location.pathname === "/create-uid" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/reset-password";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={<AuthLayout><SignIn /></AuthLayout>}
        />

        <Route
          path="/create"
          element={<AuthLayout><Create /></AuthLayout>}
        />

        <Route
          path="/create-uid"
          element={<AuthLayout><Uid /></AuthLayout>}
        />

        {/* FORGOT PASSWORD ROUTES */}
        <Route
          path="/forgot-password"
          element={<AuthLayout><ForgotPassword /></AuthLayout>}
        />

        <Route
          path="/verify-otp"
          element={<AuthLayout><VerifyOtp /></AuthLayout>}
        />

        <Route
          path="/reset-password"
          element={<AuthLayout><ResetPassword /></AuthLayout>}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout><Feed /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/createpost"
          element={
            <ProtectedRoute>
              <MainLayout><Createpost /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <MainLayout><Profile /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/finduser"
          element={
            <ProtectedRoute>
              <MainLayout><Finduser /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suggestion"
          element={
            <ProtectedRoute>
              <MainLayout><Suggestion /></MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>

      {/* MOBILE NAV ALWAYS SHOWN */}
      <MobileNav />
    </>
  );
};

export default App;
