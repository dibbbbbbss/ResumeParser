import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar2 from "./Navbar2";
import Footer from "../Footer";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar1 from "./Navbar1";
export default function AvailableJob() {
  const [jobDescData, setJobDescData] = useState([]); // State to hold job description data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const navigate = useNavigate(); // Navigate hook for routing

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recruit/get-job-data/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        
        console.log(typeof(response.data));
        // const data = response.data.parsedjd_data;
        // console.log(data)
        if (response.status === 200) {
          setJobDescData(response.data.parsedjd_data || {});
          console.log(jobDescData)
        } else {
          console.log("Failed to fetch job description data");
        }
      } catch (error) {
        console.log("Error fetching job descriptions:", error);
      } finally {
        setLoading(false); // Update loading state after fetch completes
      }
    };

    fetchData(); // Fetch data on component mount
  }, []);

  const handleJobDetail = (jobId) =>{
    navigate(`/job-detail/${jobId}`);
  }

  return (
    <>
      <Navbar1 />
       <div className="container my-5">
        <h1 className="text-center mb-4">Jobs Available</h1>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : jobDescData.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {jobDescData.map((job,index) => (
              <div key={index} className="col" onClick={()=>handleJobDetail(job.id)}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.jobpost || 'Job Title Not Available'}</h5>
                  </div>
        
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            No job available at the moment.
          </div>
        )}
      </div> 
    </>
  );
}


