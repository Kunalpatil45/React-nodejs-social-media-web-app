//  WORKING CODE
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import Create from "./pages/Create";
import Profile from "./Components/User-Profile";
import Feed from "./Components/Feed";
import "./Components/Create.css";
import Navbar from "./Components/Navbar";
import Uid from "./Components/Uid";
import Finduser from "./Components/Finduser";
import Createpost from "./Components/Createpost";



const MainLayout = ({ children }) => (
    <div className="app-container">
    <Navbar />
    <div className="main-content">{children}</div>
  </div>
  
  
);


const AuthLayout = ({ children }) => <div className="auth-container">{children}</div>;

const App = () => {
  return (
    
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/finduser" element={<MainLayout><Finduser /></MainLayout>} />
          <Route path="/login" element={<AuthLayout><SignIn /></AuthLayout>} />
          <Route path="/createpost" element={<MainLayout><Createpost /></MainLayout>} />
          <Route path="/create-uid" element={<AuthLayout><Uid /></AuthLayout>} />
          <Route path="/create" element={<AuthLayout><Create /></AuthLayout>} />
          <Route path="/" element={<MainLayout><Feed /></MainLayout>} />
          <Route path="/feed" element={<MainLayout><Feed /> </MainLayout>} />
          <Route path="/profile/:id" element={<MainLayout><Profile /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    
  );
};

export default App;







