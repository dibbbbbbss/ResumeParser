import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import landing from "../images/landing.png";
import Aos from "aos";
import "aos/dist/aos.css";

const Landing = () => {
  useEffect(() => {
    Aos.init({ duration: 2000, once: true });
  }, []);

  return (
    <section className="landing">
      <div className="landing_content" data-aos="fade-right">
        <p className="section-kicker">ATS-ready in minutes</p>
        <h1>
          Resume parsing <span className="gradient-text">simplified</span> with
          AI precision
        </h1>
        <p className="landing_subtitle">
          Let Project III translate every resume into actionable hiring data.
          Upload documents in any format, compare them to job descriptions, and
          surface the right talent in seconds.
        </p>
        <div className="landing_actions">
          <Link to="/register" className="btn btn-primary">
            Upload a Resume
          </Link>
          <a href="#gotolearn" className="btn btn-link">
            See how it works
          </a>
        </div>
        <div className="landing_stats">
          <div>
            <span>4K+</span>
            <p>Resumes analyzed</p>
          </div>
          <div>
            <span>92%</span>
            <p>Match accuracy</p>
          </div>
          <div>
            <span>48hrs</span>
            <p>Average time saved</p>
          </div>
        </div>
      </div>
      <div className="landing_visual" data-aos="fade-left">
        <div className="landing_visual_card">
          <div className="landing_visual_badge">AI insight panel</div>
          <img src={landing} alt="Hiring analytics dashboard" />
          <p>
            Real-time parsing with skill scoring, anomaly detection, and clean
            summaries for your recruiting team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Landing;
