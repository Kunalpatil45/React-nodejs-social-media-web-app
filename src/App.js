// App.js (CLEAN + FIXED)
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

// ---------------------------
// Bootstrap-Friendly Layouts
// ---------------------------

const MainLayout = ({ children }) => (
  <div className="container-fluid">
    <div className="row justify-content-center">

      <div className="col-12 col-md-10 col-lg-8 mt-3">
        {children}
      </div>

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
    <div className="col-12 col-md-6 col-lg-4">
      {children}
    </div>
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
    location.pathname === "/create-uid";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/finduser" element={<MainLayout><Finduser /></MainLayout>} />
        <Route path="/login" element={<AuthLayout><SignIn /></AuthLayout>} />
        <Route path="/createpost" element={<MainLayout><Createpost /></MainLayout>} />
        <Route path="/create-uid" element={<AuthLayout><Uid /></AuthLayout>} />
        <Route path="/create" element={<AuthLayout><Create /></AuthLayout>} />
        <Route path="/" element={<MainLayout><Feed /></MainLayout>} />
        <Route path="/profile/:id" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/suggestion" element={<MainLayout><Suggestion /></MainLayout>} />
      </Routes>
      <MobileNav />
    </>
  );
};

export default App;
