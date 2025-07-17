import React, { useState, useRef } from "react";
import axios from "axios";
import Footer from "../Footer";
import Navbar2 from "./Navbar2";

const Recruiter = () => {
  const [result, setResult] = useState(""); // State to hold upload result message
  const [file, setFile] = useState(null);   // State to hold the selected file
  const fileInputRef = useRef(null);        // Ref to file input element

  // Function to handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      const formData = new FormData(); // Create FormData object
      formData.append("jd", file);     // Append the selected file to FormData

      // Send POST request to upload file
      const response = await axios.post(
        "http://127.0.0.1:8000/recruit/jdparser/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Handle response
      if (response.status === 200) {
        setResult("File uploaded successfully");
        setFile(null);                // Clear selected file state
        fileInputRef.current.value = null; // Clear file input value
      } else {
        setResult("Uploading file failed");
      }
    } catch (error) {
      console.error("Error uploading file: ", error);
      setResult("Uploading file failed");
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="parser">
        <div className="parsing_container">
          <h1>
            Start Using Our <span className="gradient-text">Service</span>
          </h1>
          <div className="parsing_container_content">
            <h1>Job Description</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="job_description">Upload Job Description</label>
              <input
                type="file"
                id="job_description"
                name="jd"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                ref={fileInputRef} // Attach ref to file input
                required
              />
              <button type="submit">Upload</button>
            </form>
            <p className="mx-auto">{result}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Recruiter;
