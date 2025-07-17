import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Navbar1 from './Navbar1';

export default function JobDetail() {
    const {jobId} = useParams();
    const [jobDetail, setjobDetail] = useState(null);
    const [resume,setResume] = useState(null);
    const [error, setError] = useState('');
    const [result, setResult] = useState('');
    const fileInputRef = useRef(null);        // Ref to file input element

    const handleFileChange = (e) => {
      setResume(e.target.files[0]);
     };
    useEffect(()=>{
        const fetchJobDetail = async ()=>{
            try{
                const response = await axios.get(
                    `http://127.0.0.1:8000/recruit/get-job-detail/${jobId}/`,{
                        headers:{
                            Authorization:`Bearer ${localStorage.getItem('access_token')}`,
                        }
                    }
                );
                console.log(response.data.job_detail)
                if(response.status === 200){
                    setjobDetail(response.data.job_detail);
                    console.log(response.data.job_detail)
                    
                }
                else{
                    console.log('Failed to fetch job detail');
                    setError('Failed to fetch job detail');

                }

            }catch(error){
                console.log('Failed to fetch job detail: ',error);
                setError('Failed to fetch job detail');

            }
        }
        fetchJobDetail();
    },[jobId]);

    const handleResumeUpload = async(e)=>{
        e.preventDefault();
         // Function to handle file selection
   
        const formData = new FormData();
        formData.append('resume',resume);
        formData.append('job_id',jobId);
        console.log("Form data: ",formData)

    
    try{
        const response = await axios.post(`http://127.0.0.1:8000/recruit/resumeparser/`,
            formData,
            {
                headers:{
                  'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        )
        if(response.status === 200){
            setResult('Resume uploaded successfully');
        }
        else{
            setError('Failed to upload resume');
        }

    }catch(error){
        setError('Error uploading resume',error.response ? error.response.data : error.message);
    }
    };

    const renderSkills = (skillsString) => {
      // Cleaning up the skills string by removing square brackets and newlines
      const cleanedSkillsString = skillsString.replace(/[\[\]']+/g, '').replace(/\\n/g, '');

      // Spliting the cleaned skills string into an array
      const skillsArray = cleanedSkillsString.split(/,\s*/);

      // Rendering skills as list items
      return (
          <ul>
              {skillsArray.map((skill, index) => (
                  <li key={index}>{skill.trim()}</li>
              ))}
          </ul>
      );
  };

  return (
    <>
    <Navbar1/>

    <div className="container my-5">
    {jobDetail ? (
      <div>
        <h1 className="text-center mb-4">Job Post: {jobDetail.jobpost || "Not Available"}</h1>
        <p>Degree: {jobDetail.degree}</p>
        {jobDetail.skills && (
          <div>
              <p>Skills:</p>
              {renderSkills(jobDetail.skills)}
          </div>
      )}
<p>Experience: {jobDetail.experience}</p>
        <form onSubmit={handleResumeUpload}>
          <div className="mb-3">
            <label htmlFor="resume" className="form-label">Upload Resume</label>
            <input
              type="file"
              className="form-control"
              id="resume"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              ref={fileInputRef} // Attach ref to file input
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        {error && <p className='text-red'>{error}</p>}
        {result && <p className='text-green'>{result}</p>}
      </div>
    ) : (
      <div>Loading...</div>
    )}
  </div>
   
    </>
  )
}
