import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../Layout";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [message,setMessage] = useState('');
  const [role, setRole] = useState('');
  const [isAuth,setIsAuth] = useState(false);



  // const client = axios.create({
  //   baseURL: ""
  // });

  useEffect(()=>{
    if(localStorage.getItem('access_token')!==null){
      setIsAuth(true);
    }
  },[isAuth])

  const submitLogin = async(e) =>{
    e.preventDefault();
    try{

     const response = await axios.post("http://127.0.0.1:8000/api/login/",
     {
      email:email,
      password:password
     },
    {
      headers:{'Content-Type':'application/json'}
    }
    );

    console.log('Sign in successful',response.data)

    //Initialize the access and refresh token in localstorage
    localStorage.clear();
    console.log("Data is : ",response)
    console.log("Data is : ",response.data.token['access'])
    console.log("Data is : ",response.data.message)

    localStorage.setItem('access_token',response.data.token['access'])
    localStorage.setItem('refresh_token',response.data.token['refresh'])
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token['access']}`;


    setMessage(response.data.message)
    setRole(response.data.role)
    
    //Handle the case
    if(response.data.role === 'recruiter'){
      navigate('/recruiter');

    }else if(response.data.role === 'user'){
    navigate('/available-job');

    }
    
    }catch(e){
    setMessage('Invalid email or password');

    }


  }

  return (
    <>
    <Layout>
      <div className="login">
        <div className="login_container">
          <h1>Login</h1>
          <form className="login_form" onSubmit={submitLogin}>
            <div className="login_form_content">
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              <p>Forget Password ?<Link to='/forget-password'>click here</Link></p>

              <p>
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
             
            </div>
          </form>
          {message && <p style={{color:'red'}}>{message}</p>}
          {role && <p>Role: {role}</p>}
        </div>
      </div>
      </Layout>
    </>
  );
};

export default Login;
