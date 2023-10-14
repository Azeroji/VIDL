"use client"

import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

const page = () => {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState({
    username: ''
  });

  const fetchData = async (username) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/search/${username}`);
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
  }

  function handleSubmit (event) {
    event.preventDefault()
    fetchData(username.username)
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setUsername((username) => {
      return {
        ...username,
        [name]: value,
      };
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-y-[15px] px-[5%] pt-[5%]' autoComplete="off">
            <div className='relative w-[100%]'>
              <input onChange={ handleChange } type="text" placeholder="Search username.." name="username" id="username" className='w-[100%] focus:outline-none bg-transparent border border-gris p-[15px] rounded-[10px]'/>
              <button onClick={()=>{}} className='absolute right-[5%] top-[50%] translate-y-[-50%] cursor-pointer text-light'><AiOutlineSearch size={20}/></button>
            </div>
            <p></p>
      </form>
      <div className='flex flex-col px-[5%]'>
        { users.map( user => {
          return(
          <Link href={`/account/${user.username}`} className='flex items-center px-[10px] py-[10px] gap-x-[10px]'>
              <div className="rounded-full overflow-hidden h-[32px] w-[32px]">
                  <img src={user.profile_picture_url ? user.profile_picture_url : "https://ih0.redbubble.net/image.1046392278.3346/raf,360x360,075,t,fafafa:ca443f4786.jpg" } width="96px" className='object-cover w-full h-full' />
              </div>
            <p className='text-[16px] font-semibold'>{user.username}</p>
          </Link>
          )
        } ) }
      </div>
    </div>
  )
}

export default page