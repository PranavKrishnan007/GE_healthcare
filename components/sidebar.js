import React, { useEffect, useRef } from 'react'
import { UserAuth } from '@/app/context/AuthContext'

const Sidebar = ({messages, selection}) => {

  const { user } = UserAuth()
  const sidebarView = useRef(null);

  useEffect(() => {
    if(sidebarView.current) {
      const lastMessageElement = sidebarView.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="pl-5">
      <div className="w-full flex items-center justify-center pb-5">
        <div className="rounded-3xl px-3 w-1/2 py-1 bg-gray-500/30 text-center">
          History
        </div>
      </div>
      <div ref={sidebarView} className="flex flex-col max-h-[60vh] no-scrollbar sidebarView overflow-y-scroll pt-5">
        {messages?.map((entry) => {
          return(
            <button className="w-full whitespace-nowrap truncate pb-10" onClick={() => selection(entry)}>
              {entry}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
