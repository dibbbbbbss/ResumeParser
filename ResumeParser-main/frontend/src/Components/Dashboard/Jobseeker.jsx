import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";
import Footer from "../Footer";

const Jobseeker = () => {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({ duration: 2000, once: true });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const file = formData.get('resume');
    if (file) {
    
      setUploadSuccess(true); // Set success message
    }

    setTimeout(() => {
      navigate("/viewjob");
    }, 2000); 
  };

  return (
    <>
    <Navbar1/>
    <div className="parser">
      <div className="parsing_container">
        <h1 data-aos="fade-right">
          Start Using Our <span className="gradient-text">Service</span>
        </h1>
        <div className="parsing_container_content" data-aos="fade-left">
          <h1>Resume Parser</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="resume">Upload Resume:</label>
            <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required />
            <button type="submit">Parse Resume</button>
          </form>
          {uploadSuccess && <p>File successfully uploaded!</p>}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Jobseeker;
