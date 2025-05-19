import React, { useState } from "react";
import { Link } from "react-router-dom";
// import Signin from "./Signin";
import { useNavigate } from 'react-router-dom';


export default function SignUp() {
  const [formData,setFormData]=useState({});
  const [loading,setloading]=useState(false);
  const [error,setError]=useState(null);
  const[success,setSuccess]=useState(false);
   const navigate=useNavigate()
  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value
    });

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setloading(true)
    setError(null);
    try{
      console.log(formData)
      setloading(true)
    const res=await fetch('/api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',

      },
      body:JSON.stringify(formData),


    });
    const data=await res.json();
    if(res.status===201){
      setSuccess(true);
      setError(null);
      navigate('/signin')
    }else{
      setSuccess(false)
      setError(data.message||"Signup failed! !")
    }
    setloading(false)
   
    
   
    }catch(error){
      setloading(false);
      // setError(true);
    }
  }
 
  
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eafaf1] px-4">
        <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-[#d4f5ea]">
          <h1 className="text-3xl text-center font-bold text-[#3fb59c] mb-6">Sign Up</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="bg-[#f0fdf9] p-3 rounded-lg border border-[#b2ebe0] focus:outline-none focus:ring-2 focus:ring-[#6ad6c4]"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="bg-[#f0fdf9] p-3 rounded-lg border border-[#b2ebe0] focus:outline-none focus:ring-2 focus:ring-[#6ad6c4]"
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={loading}
              className={`py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3fb59c] hover:bg-[#34a28a]"
              }`}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
  
          <div className="flex gap-2 mt-6 justify-center text-sm text-gray-700">
            <p>Have an account?</p>
            <Link to="/signin" className="text-[#3fb59c] font-medium hover:underline">
              Sign In
            </Link>
          </div>
  
          {success && (
            <p className="mt-4 text-center text-green-600 font-medium text-sm">
              Successfully registered!
            </p>
          )}
          {error && (
            <p className="mt-4 text-center text-red-500 font-medium text-sm">
              {error}
            </p>
          )}
        </div>
  </div>
);
  }
  
  
  

