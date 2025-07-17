import React,{useState}from 'react'
import axios from "axios"
import { useParams ,useNavigate} from 'react-router-dom';

export default function ResetPassword() {

const navigate = useNavigate();

  const [password, setPassword] = useState('')
  const [cpassword,setCPassword] = useState('')
  const { uid, token } = useParams();
  const [passwordError,setPasswordError] = useState('');
  const [checkPasswordError,setCheckPasswordError] = useState('');
  const [error,setError] = useState();
  const handlePasswordBlur = () => {
    if (password.length < 6 || password.length > 15) {
      setPasswordError('Password must be between 6 and 15 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleCPasswordBlur = () => {
    if (password !== cpassword) {
      setCheckPasswordError('Passwords do not match');
    } else {
      setCheckPasswordError('');
    }
  };

  const submitForm = async(e)=>{
    e.preventDefault();


    try{
      const response = await axios.post(`http://localhost:8000/api/reset-password/${uid}/${token}/`,{password:password,password2:cpassword},{
        headers:{
          'Content-Type':'application/json',
        }
      })
      
      
      console.log("change password successful", response)
      navigate('/login')


    }catch(e){
      console.log("Error during change password",e)
      setError(e.response.data.errors['non_field_errors'])

    }

  }
  return (
    <>
     <div className="container py-5 flex-column">
    
     <div className='fs-4 my-4 text-light'>Reset Password</div>
    
    <form onSubmit={submitForm} className='justify-content-center flex-column'>
    <div className="col-md-6">
    <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} id="password" onBlur={handlePasswordBlur}/>
    <div><span className='error'>{passwordError}</span></div>
  </div>
  <div class="mb-3">
  <label htmlFor="exampleInputPassword1" class="form-label">Confirm Password</label>
  <input type="password" class="form-control" value={cpassword} onChange={(e)=>setCPassword(e.target.value)} id="cpassword" onBlur={handleCPasswordBlur}/>
  <div><span className='error'>{checkPasswordError}</span></div>

</div>
    </div>
  
<div className="mb-3">
<button className="btn btn-success" type="submit">confirm</button>
</div>
    </form>
    <div><span>{error}</span></div>
    </div>
    
    </>
    
  )
}