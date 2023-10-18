"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { FiUsers } from 'react-icons/fi'
import { BiSearchAlt } from 'react-icons/bi'
import { TbMessage } from 'react-icons/tb'
import { AiOutlineUser } from 'react-icons/ai'

const Navbar = (props) => {
  const pathname = usePathname();
  const hostname = window.location.hostname

  const isActive = (path) => pathname === path;
  return (
    <nav className='flex justify-between px-[10%] h-[10vh] absolute bottom-[0%] w-[100%] border-t border-gris bg-dark flex items-center'>
      <Link href="/"> <FiUsers size={32} className={`${isActive('/') ? 'text-primary' : ''} hover:text-primary`}/> </Link>
      <Link href="search"> <BiSearchAlt size={32} className={`${isActive('/search') ? 'text-primary' : ''} hover:text-primary`}/> </Link>
      <Link href="messages"> <TbMessage size={32} className={`${isActive('/messages') ? 'text-primary' : ''} hover:text-primary`}/> </Link>
      <Link href={'http://'+hostname+':3000/account'}> <AiOutlineUser size={32} className={`${isActive('/account') ? 'text-primary' : ''} hover:text-primary`}/> </Link>
    </nav>
  )
}

export default Navbar