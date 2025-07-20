import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Navbar2 from './Navbar2';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const Ranking = () => {
  const { jobId } = useParams();
  const [rankedResume, setRankedResume] = useState({});

  useEffect(() => {
    const fetchRankedResumes = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/recruit/get-ranked-resume/${jobId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.status === 200) {
          console.log(response);
          setRankedResume(response.data.ranked_resumes);
          console.log(typeof response.data.ranked_resumes);
        } else {
          console.log('Failed to fetch ranked resume');
        }
      } catch (error) {
        console.error('Failed to fetch ranked resumes', error.message);
      }
    };
    fetchRankedResumes();
  }, [jobId]);

  return (
    <>
      <Navbar2 />
      <div className="container mt-4">
        <div>
          <h1 className="text-center pb-4">Ranking</h1>
          <div>
            {rankedResume && typeof rankedResume === 'object' ? (
              Array.isArray(rankedResume) ? (
                // If it's an array
                <ul className="list-group">
                  {rankedResume.map((resume, index) => (
                    <li key={index} className="list-group-item bg-transparent shadow-sm mb-3">
                      <h3>Rank {index + 1}</h3>
                      <p>Name: {resume.name}</p>
                      <p>Email: {resume.email}</p>
                      <p>Score: {resume.score ? resume.score.toFixed(2) : 'N/A'}</p>
                      <p>Job Post: {resume.jobpost}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                // If it's an object
                <ul className="list-group">
                  {Object.entries(rankedResume).map(([key, resume], index) => (
                    <li key={key} className="list-group-item bg-transparent shadow-sm my-3">
                      <h3>Rank {index + 1}</h3>
                      <p>Name: {resume.name}</p>
                      <p>Email: {resume.email}</p>
                      <p>Score: {resume.score ? resume.score.toFixed(2) : 'N/A'}</p>
                      <p>Job Post: {resume.jobpost}</p>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p className="text-center">No ranked resumes available or data format is unexpected.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ranking;
