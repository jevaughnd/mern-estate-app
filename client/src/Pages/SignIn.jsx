// import React from 'react'

// export default function SignIn() {
//   return (
//     <div>Sign In</div>
//   )
// }


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {

  //initialize
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null);// handle error
  const [loading, setLoading] = useState(false); //handle loading state effects
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page from refreshing

    //use try catch to handle possible error in the front end
    try {
      setLoading(true) // set loading state, before request
    const res = await fetch('/api/auth/signin', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), //send from the body of the browser/frontend, send this form data as string
    });
    const data = await res.json();
    console.log(data);

    // loading condition//
    if(data.success === false){ // if there is an error set loading to false
      setLoading(false); 
      setError(data.message); 
      return;
    }
    setLoading(false); // otherwise, set loading to false because loading is completed
    setError(null) //remove error message, if user input is fine
    navigate('/'); // go to Sign In page, if user Signed Up
    } catch (error) {
      setLoading(false)
      setError(error.message); //set error to error message
    }
  };
  //console.log(formData);


  return (
    
    <div className='p-3 max-w-lg mx-auto'>
    
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      

      <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange}></input>
        <input type="text" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange}></input>

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-75'> {loading? "Loading please wait...": "Sign In"} </button> 
      </form>



        <div className='flex gap-2 mt-5'> 
          <p>Dont Have An Account? </p>
          <Link to={"/signup"}>
            <span className='text-blue-700'>Sign Up</span>
          </Link>
        </div>
        
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
