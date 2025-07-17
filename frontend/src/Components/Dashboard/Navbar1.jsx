import React from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  return (
    <>
      <nav className="navbar">
        <h1 style={{paddingLeft:'0.9rem'}}>Logo</h1>
        <ul>
          <li>
            <Link to="/available-job">Jobs</Link>
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

export default Navbar1;
