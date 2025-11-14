import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/forgot-password`,
        { email }
      );

      if (res.data.success) {
        // Store email temporarily
        localStorage.setItem("resetEmail", email);
        navigate("/verify-otp");
      }
    } catch (err) {
      alert("Failed to send OTP. Make sure email is correct.");
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
        <h2 className="fw-bold text-center mb-3">Forgot Password</h2>
        <p className="text-center text-muted mb-4">
          Enter your email to receive the OTP
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Enter your registered email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-danger small mt-1">{errors.email.message}</p>
            )}
          </div>

          <button className="btn btn-primary w-100 btn-lg">
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
