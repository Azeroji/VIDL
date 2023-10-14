"use client"

import React, { use } from 'react'
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { RiMenu5Line } from 'react-icons/ri'
import Link from 'next/link';
import Post from '@/components/Post/Post';
import { useRouter } from 'next/navigation'
import CircularProgress from '@mui/material/CircularProgress'

const Menu = (props) => {
    return (
        <div className='bg-dark flex flex-col justify-center items-center absolute top-0 w-[100%] p-[5%] border-b border-gris'>

          <div className='flex items-center justify-between w-[100%]'>
                <p className='text-[20px] text-center'>@{props.username}</p>
                <RiMenu5Line size={32} onClick={props.setShow}/>
          </div>
          
          <button onClick={props.logOut} className='focus:outline-none bg-primary text-dark font-medium p-[15px] rounded-[10px] my-[50px] w-[100%]'>Log out</button>

        </div>
    )
}

const Account = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false)

    const router = useRouter();
    const logOut = () => {
      Cookies.remove('auth_token')
      router.push('/account');
    };
  
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
            const response = await axios.get(`http://localhost:5000/api/info`, axiosConfig);
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
      </div> );
    }
    if (data && data.success) {
      const informations = data.info;
      const posts = data.info.postUrls.map( (url) => {
        return (<Post url={url} />)
      } )
      return (
        <div className='bg-dark'>
                
        <div className='p-[5%] flex flex-col gap-y-[50px] items-center border-b border-gris'>
            
            <div className='flex items-center justify-between w-[100%]'>
                <p className='text-[20px] text-center'>@{informations.username}</p>
                <RiMenu5Line size={32} onClick={()=>{setShow(true)}}/>
            </div>
            <div className='flex flex-col gap-y-[20px] items-center'>
            <div className="rounded-full overflow-hidden h-[96px] w-[96px]">
                <img src={informations.profile_picture_url ? informations.profile_picture_url : "https://ih0.redbubble.net/image.1046392278.3346/raf,360x360,075,t,fafafa:ca443f4786.jpg" } width="96px" className='object-cover w-full h-full' />
            </div>
                <p className='text-[24px] leading-none font-medium'>{informations.full_name}</p>
                <div className='flex gap-x-[20px]'>
                    <div className='text-center'>
                        <p className='text-[19px] font-medium'>{informations.following}</p>
                        <p className='text-gray-300 text-[14px]'>Follows</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-[19px] font-medium'>{informations.followers}</p>
                        <p className='text-gray-300 text-[14px]'>Followers</p>
                    </div>
                    <div className='text-center'>
                        <p className='text-[19px] font-medium'>{informations.postUrls.length}</p>
                        <p className='text-gray-300 text-[14px]'>Posts</p>
                    </div>
                </div>
                <p className='text-[16px] text-center'>{informations.bio}</p>
            </div>

        </div>
        <div className="grid grid-cols-3">
            {posts.reverse()}
        </div>

        { show && <Menu username = {informations.username} setShow = {()=>{setShow(false)}} logOut = {()=>{logOut()}} /> }

    </div>
      );
    } else {
      return (
        <div className='bg-dark h-[100%] flex flex-col justify-center items-center mx-[5%] mt-[10%]'>
            <p className='text-center text-white font-medium'>You are not logged in!</p>
            <Link href="/login" className='focus:outline-none bg-primary text-center text-dark font-medium p-[15px] w-[100%] rounded-[10px] my-[15px]'>Log in</Link>
        </div>
      );
    }
  };

  export default Account;
  