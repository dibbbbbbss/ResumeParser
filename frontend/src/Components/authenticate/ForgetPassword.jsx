import axios from 'axios';
import React, { useState } from 'react'

export default function ForgotPassword() {
  const [email,setEmail] = useState('');
  const [errorEmail,setErrorEmail] = useState('');
  const [messsage,setMessage] = useState('');
  const submitForm = async(e)=>{
    e.preventDefault();
    if(email.length === 0){
      setErrorEmail('Please provide your email');
      return;
    }
    try{

      const response = await axios.post('http://127.0.0.1:8000/api/send-reset-password-email/',{email:email},{
        headers:{
          'Content-Type':'application/json',
        }
      });
      setMessage(response.data.message)

    }catch(e){
      setErrorEmail(e.response.data.errors['non_field_errors'])
      console.log(e.response)

   
    }

  }
  return (
    <>
    <div className="container text-center py-4 my-5">
    <h3>Forgot Password</h3>
    <form onSubmit={submitForm} className='row justify-content-center'>
    <div className='col-md-6'>
    <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="user_email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-describedby="emailHelp" />
   </div>
   <div className="mb-3">
   <button className="btn btn-primary" type="submit">Submit</button>
   
   </div>
    </div>
  

    
    </form>
    <div><span className='error'>{errorEmail}</span></div>
    <div><span className='success'>{messsage}</span></div>

    </div>
    
    </>
  )
}