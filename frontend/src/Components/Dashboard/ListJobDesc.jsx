import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar2 from "./Navbar2";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

export default function ListJobDesc() {
  const [jobDescData, setJobDescData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recruit/get-parsedjd-data/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.status === 200) {
          setJobDescData(response.data.parsedjd_data || []);
        } else {
          console.log("Failed to fetch job description data");
        }
      } catch (error) {
        console.log("Error fetching job descriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRanking = (jobId) => {
    navigate(`/ranking/${jobId}`);
  };

  const handleDelete = async (e, jobId) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Delete this job description?");
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/recruit/delete-job/${jobId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        setJobDescData((prev) => prev.filter((job) => job.id !== jobId));
        setStatusMessage("Job description deleted.");
      } else {
        setStatusMessage("Failed to delete job description.");
      }
    } catch (error) {
      console.log("Error deleting job description:", error);
      setStatusMessage("Failed to delete job description.");
    }
  };

  return (
    <>
      <Navbar2 />
      <section className="job_cards_page">
        <div className="applications_header">
          <div>
            <p className="section-kicker">Manage Roles</p>
            <h1>Your Job Descriptions</h1>
            <p className="section-subtitle">
              Every parsed job post appears here. Jump to the ranking view or remove roles that are no longer hiring.
            </p>
          </div>
        </div>
        {statusMessage && (
          <div className="alert alert-info text-center" role="alert">
            {statusMessage}
          </div>
        )}
        {loading ? (
          <div className="jobs_loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your job descriptions...</p>
          </div>
        ) : jobDescData.length > 0 ? (
          <div className="job_cards_grid">
            {jobDescData.map((job) => (
              <article
                key={job.id}
                className="job_card job_card_manage"
                onClick={() => handleRanking(job.id)}
              >
                <div>
                  <p className="section-kicker">#{job.id}</p>
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
                </div>
                <p className="section-subtitle">
                  Skills: {job.skills || "Not set"}.
                </p>
                <div className="job_card_actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRanking(job.id);
                    }}
                  >
                    View Rankings
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={(e) => handleDelete(e, job.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="alert alert-info" role="alert">
            No job descriptions available at the moment.
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
