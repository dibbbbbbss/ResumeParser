import React from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  return (
    <nav className="navbar">
      <div className="navbar_brand">Project III</div>
      <ul className="navbar_menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/available-job">Jobs</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/my-applications">My Applications</Link>
          </li>
        )}
      </ul>
      <div className="navbar_actions">
        {isAuthenticated ? (
          <Link to="/logout" className="btn btn-danger">
            Logout
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar1;
