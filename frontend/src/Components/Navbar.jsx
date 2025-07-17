import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <h1 style={{paddingLeft:'0.9rem'}}>Logo</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

            <li>
              <Link to="/register" className="signin">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="signin">
                Login
              </Link>
            </li>
        
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
