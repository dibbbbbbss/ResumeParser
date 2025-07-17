import React from "react";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  return (
    <>
      <nav className="navbar">
        <h1 style={{paddingLeft:'0.9rem'}}>Logo</h1>
        <ul>
    
          <li>
            <Link to="/recruiter">Recruit</Link>
          </li>
          <li>
          <Link to="/list-job-desc">Job List</Link>
        </li>
     
          <li>
            <Link to={"/logout"} className="signin">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar2;
