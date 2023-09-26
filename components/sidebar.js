import React, { useEffect, useRef, useState } from 'react'
import { UserAuth } from '@/app/context/AuthContext'
import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5'
import { BiMessageSquareError } from 'react-icons/bi'
import { BsChatLeftText } from 'react-icons/bs'
import { PiBellSimpleRinging } from 'react-icons/pi'
import {AiOutlineUser} from "react-icons/ai";

const Sidebar = ({messages, selection, state, setMessages, isOpen, setIsOpen}) => {

  const { user, googleSignIn, logOut } = UserAuth()
  const sidebarView = useRef(null);

  useEffect(() => {
    if(sidebarView.current) {
      const lastMessageElement = sidebarView.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      setMessages([]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = async () => {
    try{
      logOut();
      setMessages([])
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="h-full bg-transparent text-black dark:text-white flex justify-between flex-col transition-all ease-in-out">
      <div className="my-5">
        <div className="whitespace-nowrap text-black  font-medium dark:text-white  overflow-hidden text-xl text-center">Recent Chat</div>
        {messages ? (
          <div ref={sidebarView} className="flex px-3 my-3 w-full flex-col h-[80vh] no-scrollbar sidebarView overflow-y-scroll">
            {messages?.map((entry) => (
              <button key={entry} className="w-full flex items-center rounded-3xl px-3 text-left hover:bg-gradient-to-r hover:from-gray-300 hover:to-white dark:hover:bg-gradient-to-r dark:hover:from-[#252525] dark:hover:to-[#171717] gap-3 py-3 transition-colors duration-500" onClick={() => selection(entry)}>
                <div className="flex-shrink-0 p-2 bg-gray-400/20 rounded-full">
                  <BsChatLeftText />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="whitespace-nowrap truncate">
                    {entry}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className={`flex h-[60vh] sidebarView items-center flex-col justify-center text-center transition-all duration-300 ease-in-out gap-3 ${state ? 'opacity-100' : 'opacity-0'}`}>
            <BiMessageSquareError size={40} />
            <div>No History Found</div>
          </div>
        )}
      </div>

      <div className="flex flex-col overflow-hidden text-center gap-2 pb-8">
        <div className="h-fit">
          {user ? (
            <button className="flex flex-row items-center justify-between cursor-pointer w-4/5 mx-auto transition-all bg-gray-200/70 dark:bg-[#252525] dark:text-white text-black px-6 py-2 rounded-lg border-green-400 dark:hover:brightness-70  hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-green-300 dark:shadow-green-800 shadow-green-300 active:shadow-none" onClick={handleLogout}>Logout <IoLogOutOutline /></button>
          ) : (
            <button className="flex flex-row items-center justify-between cursor-pointer w-4/5 mx-auto  transition-all bg-gray-200/70 dark:bg-[#252525] dark:text-white text-black px-6 py-2 rounded-lg border-green-400 dark:hover:brightness-70  hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] hover:shadow-xl hover:shadow-green-300 dark:shadow-green-800 shadow-green-300 active:shadow-none" onClick={handleSignIn}>Login <IoLogInOutline /></button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
