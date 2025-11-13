import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    navigate("/create-uid", { state: { userData: data } });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#2575fc 0%,#6a11cb 100%)",
        padding: "20px"
      }}
    >
      <div
        className="card shadow-sm p-4"
        style={{
          width: "100%",
          maxWidth: "650px",   // 🔥 WIDER CARD
          borderRadius: "15px",
          background: "#fff",
        }}
      >
        <h2 className="fw-bold text-center mb-3">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>

          {/* NAME + DOB IN ONE ROW */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                {...register("Name", { required: "Name is required" })}
                placeholder="Enter full name"
              />
              {errors.Name && <p className="text-danger small">{errors.Name.message}</p>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                {...register("dob", { required: "Date of Birth is required" })}
              />
              {errors.dob && <p className="text-danger small">{errors.dob.message}</p>}
            </div>
          </div>

          {/* GENDER + EMAIL IN ONE ROW */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                {...register("gender", { required: "Gender is required" })}
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors.gender && <p className="text-danger small">{errors.gender.message}</p>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: "Invalid email"
                  }
                })}
              />
              {errors.email && <p className="text-danger small">{errors.email.message}</p>}
            </div>
          </div>

          {/* PASSWORD (FULL ROW) */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 chars" },
                maxLength: { value: 12, message: "Max 12 chars" }
              })}
            />
            {errors.password && (
              <p className="text-danger small">{errors.password.message}</p>
            )}
          </div>

          {/* BUTTON */}
          <button className="btn btn-primary w-100 btn-lg mt-2">
            Create Account
          </button>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Create;
