import React from 'react';
import { useForm } from "react-hook-form";
import { Link , useNavigate } from "react-router-dom";



const Create = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  

  const onSubmit = (data) => {
    // Navigate to CreateUserId page with user data
    navigate("/Create-uid", { state: { userData: data } });
  };  

  return (
    <>
    
      <h1 className='webname-signup'>Twitter</h1>
      <div className="Signup-container">
        <h1>Create a New Account</h1>
        <hr />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='nameContainer'>
            <div className="userdetails">
            <div className='firstName'>
              <input
                className='Name-inputs'
                type="text"
                placeholder='First Name'
                {...register("firstName", { required: "First Name is required" })}
              />
              {errors.firstName && <p className="error">{errors.firstName.message}</p>}
            </div>

            <div className='SurName'>
              <input
                className='Name-inputs'
                type="text"
                placeholder='Sur Name'
                {...register("lastName", { required: "Last Name is required" })}
              />
              {errors.lastName && <p className="error">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className='nameContainer'>
            <div className='Birth'>
              <label htmlFor="dob">Date Of Birth</label><br />
              <input
                className='dob'
                type="date"
                {...register("dob", { required: "Date of Birth is required" })}
              />
              {errors.dob && <p className="error">{errors.dob.message}</p>}
            </div>

            <div className='gender-container'>
              <label htmlFor="gender">Gender</label><br />
              <select
                name="gender"
                className="gender"
                {...register("gender", { required: "Gender is required" })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="error">{errors.gender.message}</p>}
            </div>
          </div>

          <div className='ids'>
            <input
              className='ids-inputs'
              type="email"
              placeholder='Email ID'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input
              className='ids-inputs'
              type="password"
              placeholder='Create Password'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                maxLength: {
                  value: 12,
                  message: "Password must be no more than 12 characters",
                },
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>
          </div>
          
          <button type="submit">Create Account</button>

          <p>Already Have an account? <Link to="/login">Login Here</Link></p>
        </form>
      </div>
    </>
  );
};

export default Create;

