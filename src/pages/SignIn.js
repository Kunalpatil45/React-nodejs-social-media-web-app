import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

const SignIn = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signin`,
        data,
        { withCredentials: true }
      );

      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate(`/profile/${response.data.user.id}`);
      }
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2575fc 0%,#6a11cb 100%)",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <h2 className="fw-bold text-center mb-3">Login</h2>
        <p className="text-center text-muted mb-4">Welcome back!</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control form-control-lg"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-danger small mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              className="form-control form-control-lg"
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-danger small mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button className="btn btn-primary w-100 btn-lg">Login</button>

          <p className="text-center mt-3">
            Don’t have an account? <Link to="/create">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
