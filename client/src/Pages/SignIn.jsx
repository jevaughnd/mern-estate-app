
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';  

import { signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';



export default function SignIn() {

  //initialize
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user); // handle loading and error
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(signInStart()); 
      
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
    if(data.success === false){ // if there is an error, dispatch signin failure
      dispatch(signInFailure(data.message));
      return;
    }

    dispatch(signInSuccess(data));
    navigate('/'); // go to home page, if user Signed In

    } catch (error) {
      dispatch(signInFailure(error.message));
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
        <OAuth/>
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
