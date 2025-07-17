import React from "react";
import Landing from "./Landing";
import Services from "./Services";
import Testimonials from "./Testimonials";
import Layout from "./Layout";

const Home = () => {
  return (
    <>
    <Layout>
      <Landing />
      <Services />
      <Testimonials />
    </Layout>
    </>
  );
};

export default Home;
