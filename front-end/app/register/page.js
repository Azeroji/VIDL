"use client"

import React from 'react'
import Image from 'next/image'
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';


import { AiFillEye } from 'react-icons/ai'
import { AiFillEyeInvisible } from 'react-icons/ai'

const page = (props) => {

  const router = useRouter();

  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);
  const [account, setAccount] = useState({
    name: '',
    username: '',
    password: '',
    cpassword: '',
  });

  function strength(pwd) {
    const numberRegex = /\d/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    let c = [0, 0, 0, 0];

    if (pwd.length >= 8) {
      for (let i = 0; i < pwd.length; i++) {
        if (numberRegex.test(pwd[i])) {
          c[0] = 1;
        } else if (uppercaseRegex.test(pwd[i])) {
          c[1] = 1;
        } else if (lowercaseRegex.test(pwd[i])) {
          c[2] = 1;
        } else if (specialCharRegex.test(pwd[i])) {
          c[3] = 1;
        }
      }
    }

    return c[0] + c[1] + c[2] + c[3];
  }

  const Register = async () => {
    try {
      if (account.username !== '' && account.password !== '' && account.cpassword !== '') {
        if (account.password === account.cpassword) {
          if (strength(account.password) > 1) {
            const response = await axios.post('http://localhost:5000/api/register', {
              log: account,
            });
            if (response.data.success) {
              setMsg('Successfully connected');
              Cookies.set('auth_token', response.data.token, { expires: 7 });
              router.push('/account');
            } else {
              setMsg('Account with this username exists');
            }
          } else {
            setMsg('Password needs to be at least 8 characters long and contain 2 of these (number, lowercase, uppercase, special char)');
          }
        } else {
          setMsg('Password and Confirm password do not match');
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
            <input onChange={ handleChange } type="text" placeholder="Name" name="name" id="name" className='focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
            <input onChange={ handleChange } type="text" placeholder="Username" name="username" id="username" className='focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
            <div className='relative w-[100%]'>
              <input onChange={ handleChange } type={`${ show ? "text" : "password" }`} placeholder="Password" name="password" id="password" className='w-[100%] focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
              { show ? <AiFillEyeInvisible onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/> : <AiFillEye onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/>}
            </div>
            <div className='relative w-[100%]'>
              <input onChange={ handleChange } type={`${ show ? "text" : "password" }`} placeholder="Confirm password" name="cpassword" id="cpassword" className='w-[100%] focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
              { show ? <AiFillEyeInvisible onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/> : <AiFillEye onClick={()=>{setShow(!show)}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light' size={20}/>}
            </div>
            <p>{msg}</p>
        </form>
        <button onClick={()=>{Register()}} className='focus:outline-none bg-primary text-dark font-medium p-[15px] rounded-[10px] mx-[5%] my-[30px]'>Create account</button>
    </div>
  )
}

export default page