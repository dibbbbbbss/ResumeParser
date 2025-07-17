import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react'
import axios from "axios"
import Layout from "../Layout";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username,setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword,setCPassword] = useState('')
  const [registrationState, setRegistrationState] = useState('')
  const [role, setRole] = useState('');
  const [passwordError, setPasswordError] = useState("")
  const [usernameError,setUsernameError] = useState("")
  const [checkPasswordError,setCheckPasswordError] = useState("")


  const navigate = useNavigate();


  const handleUsernameBlur = () => {
    if (username.length < 3 || username.length > 15) {
      setUsernameError('Username must be between 3 and 15 characters long');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordBlur = () => {
    if (password.length < 6 || password.length > 15) {
      setPasswordError('Password must be between 6 and 15 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleCPasswordBlur = () => {
    if (password !== cpassword) {
      setCheckPasswordError('Passwords do not match');
    } else {
      setCheckPasswordError('');
    }
  };


  const handleSubmit = async(e) => {
    e.preventDefault();

    try{

      const response = await axios.post("http://localhost:8000/api/register/",
      {
        name:username,email:email,password:password,password2:cpassword,role:role});
        console.log(response.data)
        setRegistrationState('success');

        localStorage.setItem('access_token',response.data.token['access'])
    localStorage.setItem('refresh_token',response.data.token['refresh'])
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token['access']}`;
        //Handle the case
        if(role === 'recruiter'){
          navigate('/recruiter');

        }else if(role === 'user'){
        navigate('/available-job');

          }
    }catch(error){
        // Handle error
        // if (error.response.data.errors['non_field_errors']) {
        //   console.log(error.response.data); // Log the error response to debug
        //   setRegistrationState(error.response.data.errors['non_field_errors'] || "Registration failed");
        // } else {
        //   console.log("Error during registration:", error);
        //   setRegistrationState(error.response.data.errors['email']);
        // }
        if (error.response && error.response.data) {
          const errors = error.response.data;
    
          if (errors.email) {
            setRegistrationState(errors.email[0]);
          } else if (errors.username) {
            setRegistrationState(errors.username[0]);
          } else if (errors.non_field_errors) {
            setRegistrationState(errors.non_field_errors[0]);
          } else {
            setRegistrationState("Registration failed. Please try again.");
          }
        } else {
          setRegistrationState("An unknown error occurred. Please try again.");
        }
      
    }
  };

  return (
    <>
    <Layout>
      <div className="register">
        <form onSubmit={handleSubmit}>
          <div className="register_form">
            <h1>Register</h1>
            <h4>Please fill in this form to create an account.</h4>
            <hr />
            <input
             type="text"
             placeholder="Enter your Name"
             id="username"
             name="username"
             value={username}
             onChange={(e) => setUsername(e.target.value)}
             onBlur={handleUsernameBlur}
             autoComplete="off"
             required
            />
            <span className="error">{usernameError}</span>


            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={email} 
              onChange={(e)=>{setEmail(e.target.value)}}
              id="email"
              autoComplete="off"
              required
            />

            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              value={password} 
              onChange={(e)=>{setPassword(e.target.value)}}
              onBlur={handlePasswordBlur}
              id="psw"
              autoComplete="off"
              required
            />
          <span className="error">{passwordError}</span>
            <input
              type="password"
              placeholder="Repeat Password"
              name="psw-repeat"
              value={cpassword} 
              onChange={(e)=>{setCPassword(e.target.value)}}
              onBlur={handleCPasswordBlur}
              id="psw-repeat"
              autoComplete="off"
              required
            />
            <span className="error">{checkPasswordError}</span>

            <select
        className="form-select"
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <option value="" disabled>Select Role</option>
        <option value="user">Job Seeker</option>
        <option value="recruiter">Job Recruiter</option>
      </select>
            <button type="submit" className="registerbtn">
              Register
            </button>

            <p><span style={{color:'red'}}>{registrationState}</span></p>
          
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
      </Layout>
    </>
  );
};

export default Register;
