import React from 'react'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import { GoLightBulb } from 'react-icons/go'
import { HiMiniBars4 } from 'react-icons/hi2'
import { AiOutlineUser } from 'react-icons/ai'

const TopBar = ({sideBar, setSidebar, admin}) => {
  const { user } = UserAuth();

  const handleThemeChange = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

  return (
    <div className="w-full flex gap-10 justify-between items-center bg-white p-1 pr-14 dark:bg-black text-white">
      <div className="text-xl flex flex-row gap-6 items-center justify-center font-bold text-black dark:text-white">
        {admin ? null : <button className="transition-all hover:scale-110 p-2 rounded-full duration-100" onClick={() => setSidebar(!sideBar)}><HiMiniBars4 /></button>}
        <div className={`${admin ? 'pl-10' : ''}`}>AmFOSS Bot.</div>
      </div>
      <div className="flex flex-row items-center justify-center gap-10">
        <button className="relative bg-gray-400/20 hover:bg-gray-400 transition-all hover:scale-110 p-2 rounded-full duration-100 inline-block text-lg group dark:text-white text-black" onClick={() => handleThemeChange()}>
          <GoLightBulb />
        </button>
        {user ? (
          <div className="font-semibold flex flex-row gap-3 items-center justify-center" >
            <span className="tracking-wider text-black text-lg dark:text-white">
              Welcome, {' '}
              <span className="text-amber-500 dark:text-amber-800 font-bold">
                {user ? user?.displayName.split(' ')[0] : "Guest"}
              </span>
            </span>
            <Image src={user?.photoURL} className="rounded-full" alt="userImage" width={30} height={30}/>
          </div>
        ) : (
          <div className="flex flex-row items-center text-black dark:text-white justify-center gap-3 text-lg">Welcome, Guest <span className="font-extrabold border-2 p-2 rounded-full"><AiOutlineUser className="" /></span></div>
        )}
      </div>
    </div>
  )
}

export default TopBar;
