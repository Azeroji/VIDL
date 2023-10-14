"use client"

import React, {useState} from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import { BiImageAdd } from 'react-icons/bi'
import Image from 'next/image';

const UploadPost = () => {
    const token = Cookies.get('auth_token');
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleCaptionChange = (e) => {
      setCaption(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (file) {
        try {
          const formData = new FormData();
          formData.append('fileName', file);
          formData.append('caption', caption);
  
          const response = await axios.post('http://localhost:5000/api/uploadpost', formData, {
            headers: {
              'Authorization': token,
              'Content-Type': 'multipart/form-data',
            },
          });
  
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    return (
        <div className='bg-dark text-light flex flex-col justify-center'>
          <div className='flex justify-center my-[10%]'>
            <Image src="/images/logo.png" width={180} height={63} alt="logo" className='flex flex-col items-center'/>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-y-[15px] px-[5%] mx-[5%]'>
          <div className='border rounded-[10px] border-[2px] border-primary p-[20px] flex justify-center items-center gap-x-[10px] h-[20vh]'>
              <BiImageAdd size={32} className='text-primary' />
              <label htmlFor="file" className='text-primary'>Add image</label>
              <input type="file" id="file" onChange={handleFileChange} accept="image/*" hidden/>
            </div>
            <div>
              <input type="text" id="caption" value={caption} onChange={handleCaptionChange} placeholder="Caption" className='focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px] w-[100%]' />
            </div>
            <button type="submit" className='focus:outline-none bg-primary text-dark font-medium p-[15px] rounded-[10px]'>Upload</button>
          </form>
      </div>
      )
    }

  export default UploadPost;