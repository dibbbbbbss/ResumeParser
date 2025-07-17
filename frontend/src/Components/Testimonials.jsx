import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Aos from "aos";
import "aos/dist/aos.css";
import avatar from'../images/avatar.png'


const testimonialsData = [
  {
    id: 1,
    author: "Binod Dhamala",
    text: "Your resume, our code - a perfect match.",
    image: avatar,
  },
  {
    id: 2,
    author: "Arjun Uchai Thakuri",
    text: "In the world of resumes, let our code be your guiding light.",
    image: avatar,
  },
  {
    id: 3,
    author: "Swastik Chaudhary",
    text: "Unleash the power of code to decode resumes effortlessly.",
    image: avatar,
  },
  {
    id: 4,
    author: "Prasidha Pokhreal",
    text: "Elevating HR tech with intelligent resume parsing solutions.",
    image: avatar,
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
    <>
      <div className="testimonial">
        <div className="testimonial_box" data-aos="fade-up">
          <h1>
            <span className="gradient-text">Hear</span> From Our
            <span className="gradient-text"> Team</span>
          </h1>
          <div className="testimonial_container">
            <Slider {...sliderSettings}>
              {testimonialsData.map((testimonial) => (
                <Testimoni key={testimonial.id} {...testimonial} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonials;
