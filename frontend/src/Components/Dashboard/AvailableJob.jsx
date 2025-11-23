import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import { Link, useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar1";

export default function AvailableJob() {
  const [jobDescData, setJobDescData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("access_token");
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const response = await axios.get(
          "http://127.0.0.1:8000/recruit/get-job-data/",
          { headers }
        );

        if (response.status === 200) {
          const payload =
            response.data?.parsedjd_data ?? response.data ?? [];
          const normalized = Array.isArray(payload)
            ? payload
            : Object.values(payload);
          setJobDescData(normalized);
        } else {
          setError("Unable to load jobs right now.");
        }
      } catch (fetchError) {
        console.log("Error fetching job descriptions:", fetchError);
        setError("Unable to load jobs right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJobDetail = (jobId) => {
    if (!jobId) return;
    navigate(`/job-detail/${jobId}`);
  };

  const renderSkills = (skills) => {
    if (!skills) return null;
    if (Array.isArray(skills)) {
      return skills;
    }
    if (typeof skills === "string") {
      return skills.split(",").map((skill) => skill.trim());
    }
    return [];
  };

  return (
    <>
      <Navbar1 />
      <section className="jobs_page">
        <div className="jobs_header">
          <p className="section-kicker">Open Positions</p>
          <h1>Browse curated roles powered by Project III</h1>
          <p className="section-subtitle">
            Every listing below includes AI-parsed skills and requirements so
            you can instantly see if it is the right fit.{" "}
            {!isAuthenticated &&
              "Login or create an account to submit your resume to any role."}
          </p>
          {!isAuthenticated && (
            <div className="jobs_header_actions">
              <Link to="/login" className="btn btn-outline">
                Login to apply
              </Link>
              <Link to="/register" className="btn btn-primary">
                Create free account
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="jobs_loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Finding the latest openings...</p>
          </div>
        ) : error ? (
          <div className="alert alert-info" role="alert">
            {error}
          </div>
        ) : jobDescData.length > 0 ? (
          <div className="jobs_grid">
            {jobDescData.map((job) => (
              <article key={job.id} className="job_card">
                <header>
                  <h3>{job.jobpost || "Untitled Role"}</h3>
                  <p className="job_card_meta">
                    {job.degree && <span>{job.degree}</span>}
                    {job.experience && (
                      <span>
                        {job.degree ? " • " : ""}
                        {job.experience}
                      </span>
                    )}
                  </p>
                </header>
                {renderSkills(job.skills)?.length > 0 && (
                  <div className="job_card_badges">
                    {renderSkills(job.skills).map((skill, index) => (
                      <span key={`${job.id}-${skill}-${index}`}>{skill}</span>
                    ))}
                  </div>
                )}
                <div className="job_card_actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => handleJobDetail(job.id)}
                  >
                    View Details
                  </button>
                  {isAuthenticated ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleJobDetail(job.id)}
                    >
                      Apply Now
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="btn btn-primary">
                        Login to Apply
                      </Link>
                      <Link to="/register" className="btn btn-outline">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            No jobs available at the moment.
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

