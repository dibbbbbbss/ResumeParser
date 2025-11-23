import React from "react";
import { Link } from "react-router-dom";

const Navbar2 = () => {
  return (
    <nav className="navbar">
      <div className="navbar_brand">Project III - Dibyan and Brihat</div>
      <div className="navbar_actions">
        <Link to="/recruiter" className="btn btn-outline">
          Recruit
        </Link>
        <Link to="/list-job-desc" className="btn btn-primary">
          Job List
        </Link>
        <Link to="/logout" className="btn btn-danger">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar2;
