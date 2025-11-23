import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar1 from "./Navbar1";
import Footer from "../Footer";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/recruit/my-applications/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (response.status === 200) {
          setApplications(response.data?.applications || []);
        } else {
          setError("Unable to load your applications.");
        }
      } catch (fetchError) {
        console.error("Failed to load applications", fetchError);
        setError("Unable to load your applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "Submitted":
        return "Submitted";
      case "Under Review":
        return "Under Review";
      case "Shortlisted":
        return "Shortlisted";
      case "Rejected":
        return "Not Selected";
      default:
        return status || "Submitted";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this application? Recruiters will no longer see it.")) {
      return;
    }
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/recruit/delete-application/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 200) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        setActionMessage("Application removed successfully.");
      } else {
        setActionMessage("Unable to delete application.");
      }
    } catch (deleteError) {
      setActionMessage("Unable to delete application.");
    }
  };

  return (
    <>
      <Navbar1 />
      <section className="applications_page">
        <div className="applications_header">
          <p className="section-kicker">Application Status</p>
          <h1>My Applications</h1>
          <p className="section-subtitle">
            Track every resume you’ve submitted through Project III. Once a
            recruiter reviews your profile, status updates will appear here.
          </p>
        </div>
        {loading ? (
          <div className="jobs_loader">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Gathering your submissions...</p>
          </div>
        ) : error ? (
          <div className="alert alert-info" role="alert">
            {error}
          </div>
        ) : applications.length === 0 ? (
          <div className="alert alert-info" role="alert">
            You haven’t submitted any resumes yet. Apply to a job to see it
            listed here.
          </div>
        ) : (
          <>
            {actionMessage && (
              <p className="text-green" style={{ textAlign: "center" }}>
                {actionMessage}
              </p>
            )}
            <div className="applications_grid">
            {applications.map((application) => (
              <article key={application.id} className="application_card">
                <div className="application_card_header">
                  <div>
                    <p className="section-kicker">#{application.id}</p>
                    <h3>{application.jobpost}</h3>
                  </div>
                  <span className={`status_chip ${application.status.toLowerCase()}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>
                <div className="application_card_body">
                  <div>
                    <p className="application_label">Submitted email</p>
                    <p className="application_value">
                      {application.email || "Email pending"}
                    </p>
                  </div>
                  <div>
                    <p className="application_label">Experience</p>
                    <p className="application_value">
                      {application.experience || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="application_label">Skills snapshot</p>
                    <p className="application_value">
                      {application.skills
                        ? application.skills.split(",").slice(0, 2).join(", ") +
                          (application.skills.split(",").length > 2 ? "…" : "")
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="application_card_footer">
                  <div>
                    <p className="application_label">Application controls</p>
                    <p className="application_value">
                      Remove this submission if you no longer wish to be considered.
                    </p>
                  </div>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(application.id)}
                  >
                    Delete Application
                  </button>
                </div>
              </article>
            ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
};

export default MyApplications;
