"use client"

import React from 'react'
import Image from 'next/image'
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'


import { AiFillEye } from 'react-icons/ai'
import { AiFillEyeInvisible } from 'react-icons/ai'


const page = (props) => {

  const router = useRouter();

  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

  const Login = async () => {
    try {
      if (account.username !== '' && account.password !== '') {
        const response = await axios.post('http://localhost:5000/api/login', {
          log: account,
        });
        if (response.data.success) {
          setMsg('Successfully connected');
          Cookies.set('auth_token', response.data.token, { expires: 7 });
          router.push('/account');
        } else {
          setMsg('Wrong username or password!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  function handleChange(event) {
    const { name, value } = event.target;
    setAccount((account) => {
      return {
        ...account,
        [name]: value,
      };
    });
  }

  return (
    <div className='bg-dark text-light flex flex-col justify-center'>
        
        <div className='flex justify-center my-[10%]'>
            <Image src="/images/logo.png" width={180} height={63} alt="logo" className='flex flex-col items-center'/>
        </div>
        <form action="" className='flex flex-col gap-y-[15px] px-[5%]' autoComplete="off">
            <input onChange={ handleChange } type="text" placeholder="Username" name="username" id="username" className='focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
            <div className='relative w-[100%]'>
              <input onChange={ handleChange } type={`${ show ? "text" : "password" }`} placeholder="Password" name="password" id="password" className='w-[100%] focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
              { show ? <AiFillEyeInvisible onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/> : <AiFillEye onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/>}
            </div>
            <p>{msg}</p>
            <Link href="/register" className='text-right text-secondary font-medium'>Don't have an account?</Link>
        </form>
        <button onClick={()=>{Login()}} className='focus:outline-none bg-primary text-dark font-medium p-[15px] rounded-[10px] mx-[5%] my-[30px]'>Log in</button>
    </div>
  )
}

export default page