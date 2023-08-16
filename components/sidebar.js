import React, { useEffect, useRef, useState } from 'react'
import { UserAuth } from '@/app/context/AuthContext'
import { IoLogInOutline, IoLogOutOutline } from 'react-icons/io5'
import { BiMessageSquareError } from 'react-icons/bi'
import { BsChatLeftText } from 'react-icons/bs'
import { PiBellSimpleRinging } from 'react-icons/pi'

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
    <div className="pl-5 h-full text-black dark:text-white flex justify-between flex-col transition-all ease-in-out">
      <div className="my-5">
        <div className="whitespace-nowrap font-extrabold">Recent Conversations</div>
        {messages ? (
          <div ref={sidebarView} className="flex my-3 w-full flex-col h-[60vh] no-scrollbar sidebarView overflow-y-scroll">
            {messages?.map((entry) => (
              <button key={entry} className="w-full flex items-center rounded-3xl px-3 text-left hover:bg-gradient-to-r hover:from-gray-300 hover:to-white dark:hover:bg-gradient-to-r dark:hover:from-gray-600 dark:hover:to-black gap-3 py-3 transition-colors duration-500" onClick={() => selection(entry)}>
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

      <div className="flex flex-col gap-2 pb-8">
        {user && (
          <div>
            <button className="flex flex-row items-center justify-center gap-2" onClick={() => setIsOpen(!isOpen)}>Want Praveshan Notification ? <PiBellSimpleRinging /></button>
          </div>
        )}
        <div>
          {user ? (
            <button className="flex flex-row items-center justify-center gap-2" onClick={handleLogout}>Logout <IoLogOutOutline /></button>
          ) : (
            <button className="flex flex-row items-center justify-center gap-2" onClick={handleSignIn}>Login <IoLogInOutline /></button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
