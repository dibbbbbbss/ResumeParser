import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Aos from "aos";
import "aos/dist/aos.css";
import brihat from "../images/brihat.jpeg";
import dibyan from "../images/dibyan.jpg";

const testimonialsData = [
  {
    id: 1,
    author: "Brihat Lamichhaney",
    text: "Your resume, our code - a perfect match.",
    image: brihat,
  },
  {
    id: 2,
    author: "Dibyan Neupane",
    text: "In the world of resumes, let our code be your guiding light.",
    image: dibyan,
  },
];

const Testimoni = ({ author, text, image }) => (
  <div className="testimonial_container_content">
    <img className="testimonial_image" src={image} alt={`${author}'s avatar`} />
    <p className="testimonial_text">{text}</p>
    <p className="testimonial_author">- {author}</p>
  </div>
);

const Testimonials = () => {
  useEffect(() => {
    Aos.init({ duration: 2000, once: true });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="testimonial">
      <div className="testimonial_header" data-aos="fade-up">
        <p className="section-kicker">Hear From Our Team</p>
        <h2>
          Stories from <span className="gradient-text">Dibyan</span> and{" "}
          <span className="gradient-text">Brihat</span>
        </h2>
        <p className="section-subtitle">
          Built by engineers who obsess over seamless hiring experiences. Here’s
          what motivates our work every day.
        </p>
      </div>
      <div className="testimonial_slider" data-aos="fade-up">
        <Slider {...sliderSettings}>
          {testimonialsData.map((testimonial) => (
            <Testimoni key={testimonial.id} {...testimonial} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
