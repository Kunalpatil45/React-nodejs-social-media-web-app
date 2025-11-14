import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const email = localStorage.getItem("resetEmail");

  const onSubmit = async ({ otp }) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/verify-otp`,
        { email, otp }
      );

      if (res.data.success) {
        navigate("/reset-password");
      }
    } catch (err) {
      alert("Invalid or expired OTP");
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
        <h2 className="fw-bold text-center mb-3">Verify OTP</h2>
        <p className="text-center text-muted mb-4">
          Enter the 6-digit OTP sent to <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">OTP</label>
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Enter OTP"
              {...register("otp", {
                required: "OTP is required",
                minLength: { value: 6, message: "OTP must be 6 digits" },
                maxLength: { value: 6, message: "OTP must be 6 digits" },
              })}
            />
            {errors.otp && (
              <p className="text-danger small mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button className="btn btn-primary w-100 btn-lg">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
