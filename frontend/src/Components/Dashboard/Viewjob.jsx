import React from 'react'
import Navbar1 from './Navbar1'
import Footer from '../Footer'

const Viewjob = () => {
  return (
    <>
    <Navbar1/>
    <div className="parser">
      <div className="parsing_container">
        <h1 data-aos="fade-right">
          Job details........
        </h1>
        <div className="parsing_container_content" data-aos="fade-left">
      
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default Viewjob