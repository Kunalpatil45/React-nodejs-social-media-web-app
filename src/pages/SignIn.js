

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";  
import "./signin.css";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useContext(UserContext);  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signin`, data, { withCredentials: true });
    
      console.log("Login Response:", response.data.user);
    
      if (response.data.user) {  
        setUser(response.data.user); 
        localStorage.setItem("user", JSON.stringify(response.data.user)); 
        navigate(`/profile/${response.data.user.id}`);  
      } else {
        console.error("User data missing in response");
      }
    } catch (error) {
      alert("login Failed , please try again!!!!");
      console.error("Login failed:", error.response?.data || error.message);
    }
  }    

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}> 
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label><br />
          <input
            className="input-field"
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label><br />
          <input
            className="input-field"
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        {errors.form && <p className="error">{errors.form.message}</p>}
        <button className="lbtn" type="submit">Login</button>
        <p>Don't have an account? <Link to="/Create">Sign up</Link></p>
      </form>
      <div className="right-view">
        <div className="webname">Poster</div>
        <div className="description">Share your thoughts and moments with Images!</div>
      </div>
    </div>
  );
};

export default Login;
