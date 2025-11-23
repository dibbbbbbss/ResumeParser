import React, { useEffect } from "react";
import fileFormat from "../images/fileformat.png";
import resume from "../images/resume.png";
import summary from "../images/summary.png";
import ranking from "../images/ranking.png";
import Aos from "aos";
import "aos/dist/aos.css";

const features = [
  {
    id: 1,
    title: "Accepts Multiple Formats",
    description: "Upload DOCX, PDF, or TXT files without losing structure.",
    image: fileFormat,
  },
  {
    id: 2,
    title: "Extracts Resume Data",
    description: "Parse contact details, skills, and experience automatically.",
    image: resume,
  },
  {
    id: 3,
    title: "Summarizes instantly",
    description: "Get a concise, human-ready summary tailored to each role.",
    image: summary,
  },
  {
    id: 4,
    title: "Ranks by fit",
    description: "Scores candidates against job descriptions with AI matching.",
    image: ranking,
  },
];

const Services = () => {
  useEffect(() => {
    Aos.init({ duration: 2000, once: true });
  }, []);

  return (
    <section className="services" id="gotolearn">
      <p className="section-kicker" data-aos="fade-up">
        Platform Highlights
      </p>
      <h2 data-aos="fade-up">
        Everything you need to <span className="gradient-text">hire faster</span>
      </h2>
      <p className="section-subtitle" data-aos="fade-up">
        A modern UI with built-in intelligence so recruiters and job seekers
        stay in sync.
      </p>
      <div className="services_grid">
        {features.map((feature, index) => (
          <article
            key={feature.id}
            className="service_card"
            data-aos="fade-up"
            data-aos-delay={index * 150}
          >
            <div className="service_icon">
              <img src={feature.image} alt={feature.title} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;
