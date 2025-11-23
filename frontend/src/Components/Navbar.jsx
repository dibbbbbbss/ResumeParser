import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar_brand">Project III - Dibyan and Brihat</div>
      <ul className="navbar_menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <a href="#gotolearn">Features</a>
        </li>
        <li>
          <Link to="/available-job">Jobs</Link>
        </li>
      </ul>
      <div className="navbar_actions">
        <Link to="/login" className="btn btn-outline">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
