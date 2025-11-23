import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar1 from "./Navbar1";

export default function JobDetail() {
  const { jobId } = useParams();
  const [jobDetail, setJobDetail] = useState(null);
  const [resume, setResume] = useState(null);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      setPageError("");
      try {
        const token = localStorage.getItem("access_token");
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
        const response = await axios.get(
          `http://127.0.0.1:8000/recruit/get-job-detail/${jobId}/`,
          { headers }
        );

        if (response.status === 200 && response.data?.job_detail) {
          setJobDetail(response.data.job_detail);
        } else {
          setPageError("Failed to fetch job detail.");
        }
      } catch (fetchError) {
        console.log("Failed to fetch job detail: ", fetchError);
        setPageError("Failed to fetch job detail. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [jobId]);

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setFormError("");
    setResult("");
    if (!resume) {
      setFormError("Please select a resume file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("job_id", jobId);
      const response = await axios.post(
        `http://127.0.0.1:8000/recruit/resumeparser/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        setResult(
          "Resume uploaded successfully. A recruiter will reach out via email or phone if there's a match."
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFormError("Failed to upload resume.");
      }
    } catch (uploadError) {
      setFormError(
        uploadError.response?.data?.error ||
          "Error uploading resume. Please try again."
      );
    }
  };

  const renderSkills = (skillsString) => {
    if (!skillsString) return [];
    const cleanedSkillsString = skillsString
      .replace(/[\[\]']+/g, "")
      .replace(/\\n/g, "");
    return cleanedSkillsString
      .split(/,\s*/)
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  return (
    <>
      <Navbar1 />
      <section className="job_detail_page">
        {loading ? (
          <div className="jobs_loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading job detail...</p>
          </div>
        ) : pageError ? (
          <div className="alert alert-info" role="alert">
            {pageError}
          </div>
        ) : jobDetail ? (
          <div className="job_detail_card">
            <header>
              <p className="section-kicker">Job Detail</p>
              <h1>{jobDetail.jobpost || "Untitled Role"}</h1>
              <p className="job_card_meta">
                {jobDetail.degree && <span>{jobDetail.degree}</span>}
                {jobDetail.experience && (
                  <span>
                    {jobDetail.degree ? " • " : ""}
                    {jobDetail.experience}
                  </span>
                )}
              </p>
            </header>

            {renderSkills(jobDetail.skills).length > 0 && (
              <div>
                <p className="section-subtitle">Highlighted Skills</p>
                <div className="job_card_badges">
                  {renderSkills(jobDetail.skills).map((skill, index) => (
                    <span key={`${skill}-${index}`}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="job_detail_actions">
              {isAuthenticated ? (
                <form onSubmit={handleResumeUpload}>
                  <label htmlFor="resume" className="form-label">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit Resume
                  </button>
                </form>
              ) : (
                <div className="job_detail_cta">
                  <p>Login or register to upload your resume for this role.</p>
                  <div>
                    <Link to="/login" className="btn btn-outline">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                      Register
                    </Link>
                  </div>
                </div>
              )}
              {formError && <p className="text-red">{formError}</p>}
              {result && <p className="text-green">{result}</p>}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
