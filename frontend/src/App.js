import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/authenticate/Login.jsx";
import Register from "./Components/authenticate/Register.jsx";
import Jobseeker from "./Components/Dashboard/Jobseeker.jsx";
import Recruiter from "./Components/Dashboard/Recruiter.jsx";
import Viewjob from "./Components/Dashboard/Viewjob.jsx";
import Ranking from "./Components/Dashboard/Ranking.jsx";
import ForgotPassword from "./Components/authenticate/ForgetPassword.jsx";
import ResetPassword from "./Components/authenticate/ResetPassword.jsx";
import Logout from "./Components/authenticate/logout.jsx";
import ListJobDesc from "./Components/Dashboard/ListJobDesc.jsx";
import './Components/interceptor/axios.js';
import AvailableJob from "./Components/Dashboard/AvailableJob.jsx";
import JobDetail from "./Components/Dashboard/JobDetail.jsx";

const App = () => {
  
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/jobseeker" element={<Jobseeker/>} />
          <Route path="/available-job" element={<AvailableJob/>}/>
          <Route path="/recruiter" element={<Recruiter/>} />
          <Route path="/list-job-desc" element={<ListJobDesc/>}/>
          <Route path="/job-detail/:jobId" element={<JobDetail/>}/>
          <Route path="/viewjob" element={<Viewjob/>} />
          <Route path="/ranking/:jobId" element={<Ranking/>} />
          <Route path="/logout" element={<Logout/>} />
          <Route path="/forget-password" element={<ForgotPassword/>} />
          <Route path="reset-password/:uid/:token" element={<ResetPassword/>}/>



        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
