"use client"

import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

import { AiOutlinePlus } from 'react-icons/ai'
import { PiBellBold } from 'react-icons/pi'
import CircularProgress from '@mui/material/CircularProgress'

const Post = (props) => {
    return (
      <div className='border-t-[0.25px] border-gris'>
        <Link href={`/account/${props.username}`} className='flex items-center px-[10px] py-[10px] gap-x-[10px]'>
            <div className="rounded-full overflow-hidden h-[32px] w-[32px]">
                <img src={props.profile_picture_url ? props.profile_picture_url : "https://ih0.redbubble.net/image.1046392278.3346/raf,360x360,075,t,fafafa:ca443f4786.jpg" } width="96px" className='object-cover w-full h-full' />
            </div>
          <p className='text-[16px] font-semibold'>{props.username}</p>
        </Link>
        <div className="border-t border-b border-gris h-[100vw] w-[100vw]">
            <img src={props.url} alt="Image" className="object-cover w-full h-full" />
        </div>
        <p className='text-[16px] px-[10px] font-regular py-[10px] mb-[15px]'><span className='font-semibold'> {props.username}</span><span className='font-regular'> {props.caption}</span></p>
      </div>
    )
  }

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('auth_token');  
      if (token) {
        const axiosConfig = {
          headers: {
            'Authorization': token,
          },
        };

        try {
          const hostname = window.location.hostname
          const response = await axios.get('http://'+hostname+':5000/api/feed', axiosConfig);
          setData(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      } else {
          setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
    <div className='flex justify-center h-[90vh] items-center text-primary'>
      <CircularProgress color="inherit" />
    </div>);
  }

  return (
    <main className="bg-dark">
      <div className="flex justify-between p-[5%] items-center w-[100%]">
        <Image src="/images/logo.png" width={120} height={42} alt="logo" />
        <div className='flex items-center gap-x-[20px]'>
          <Link href="#" ><PiBellBold size={32} className='hover:text-secondary'/></Link>
          <Link href="/post" className='flex gap-x-[5px] items-center py-[10px] px-[15px] bg-gris rounded-full'>
            <AiOutlinePlus size={20}/>
            <p className='text-[18px]'>Post</p>
          </Link>
        </div>
      </div>
      <div>
        { data && data.posts.map( post => { return(
          <Post username={post.username} profile_picture_url={post.profile_picture_url} url={post.url} caption={post.caption} />
        ) } ) }
      </div>
    </main>
  )
}
