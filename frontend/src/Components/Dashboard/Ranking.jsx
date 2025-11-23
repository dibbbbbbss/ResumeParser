import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Navbar2 from "./Navbar2";
import { useParams } from "react-router-dom";
import axios from "axios";

const Ranking = () => {
  const { jobId } = useParams();
  const [rankedResumes, setRankedResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRankedResumes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/recruit/get-ranked-resume/${jobId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (response.status === 200) {
          const payload = response.data?.ranked_resumes;
          let normalized = [];
          if (Array.isArray(payload)) {
            normalized = payload;
          } else if (payload && typeof payload === "object") {
            normalized = Object.values(payload);
          }
          setRankedResumes(normalized);
          if (!normalized.length) {
            setError("No ranked resumes available yet.");
          }
        } else {
          setError("Failed to fetch ranked resumes.");
        }
      } catch (fetchError) {
        console.error("Failed to fetch ranked resumes", fetchError.message);
        setError("Unable to load ranking data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRankedResumes();
  }, [jobId]);

  const formatScore = (score) =>
    typeof score === "number" ? score.toFixed(2) : "N/A";

  return (
    <>
      <Navbar2 />
      <section className="ranking_page">
        <div className="ranking_header">
          <p className="section-kicker">Match Insights</p>
          <h1>Resume ranking for job #{jobId}</h1>
          <p className="section-subtitle">
            We compare every submitted resume against the job description,
            scoring skills, experience, and education. Higher scores mean better
            alignment with the requirements.
          </p>
        </div>

        {loading ? (
          <div className="jobs_loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Crunching the scores...</p>
          </div>
        ) : error ? (
          <div className="alert alert-info" role="alert">
            {error}
          </div>
        ) : (
          <div className="ranking_grid">
            {rankedResumes.map((resume, index) => (
              <article key={`${resume.id || index}`} className="ranking_card">
                <div className="ranking_rank">
                  <span>#{index + 1}</span>
                  <p>Rank</p>
                </div>
                <div className="ranking_content">
                  <h3>{resume.name || "Candidate"}</h3>
                  <p className="ranking_meta">{resume.email || "No email"}</p>
                  <div className="ranking_badges">
                    <span>{formatScore(resume.score)} score</span>
                    {resume.jobpost && <span>{resume.jobpost}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default Ranking;
