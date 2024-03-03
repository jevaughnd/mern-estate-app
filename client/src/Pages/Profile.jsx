
import {useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';


export default function Profile() {

  const fileRef = useRef(null); // to use with image file upload, 

  const {currentUser} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0); //file upload percentage
  const [fileUploadError, setFileUploadError ] = useState (false);  //handle file upload error

  const [formData, setFormData] = useState({});


  //--------------------------------------------------
  // fire base storage

  // allow read; 
  // allow write: if 
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*');
  //----------------------------------------------------



  //Handle File Upload

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);



  //FILE UPLOAD
  const handleFileUpload = (file) =>{
    const storage  = getStorage(app);
    const fileName = new Date().getTime() + file.name;  //unique file name
    const storageRef = ref (storage, fileName); //storage reference
    const uploadTask = uploadBytesResumable(storageRef, file); // for percentage


    //UPLOAD TASK (show upload file percentage)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred /
        snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },

      (error) =>{
        setFileUploadError(true);
      },

      () =>{
        //get file
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadUrl) => 
          setFormData({...formData, avatar: downloadUrl})
        );
      }
    );
  };

  ///EXPLANATION
  // once upload task is created, it tracks the chages and takes the snapshot first,
  // then used to create the progress,
  // then set the percentage, then handle error if any,
  // then finally get the file download url
  ///---------------------------------------------------------------------------------


  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'  > Your Profile</h1>

        <form className='flex flex-col gap-4'>

          {/*Image File Upload*/}
          <input onChange={ (e)=>setFile (e.target.files[0])  } type="file" ref={fileRef} hidden accept='image/'/>  

          <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' 
                className='rounded-full h-24  w-24 object-cover cursor-pointer self-center mt-2'>
          </img>


          {/* File Upload Messages And Conditions */}
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>Error Uploading, (Image Must Be Less Than 2 mb) </span> 
              
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'> {`Uploading ${filePerc}%`} </span>

            ) : filePerc === 100 ? (
              <span className='text-green-700'>Image Successfully Uploaded! </span>
            ) : ('') 
            }
          </p>


          <input id='username' type ="text" placeholder='username' className='border p-3 rounded-lg'  />
          <input id='email' type ="email" placeholder='email' className='border p-3 rounded-lg'  />
          <input id='password' type ="password" placeholder='password' className='border p-3 rounded-lg'  />

          <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'  > Update Profile</button>
        </form>


        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete Account</span>
          <span className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>


    </div>
    


  )
}
