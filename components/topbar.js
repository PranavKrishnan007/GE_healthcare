import React, { useState } from 'react'
import { UserAuth } from '@/app/context/AuthContext'

const TopBar = ({sideBar, setSidebar}) => {
  const [dropDown, setDropDown] = useState(false);
  const { user, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  }

  const handleThemeChange = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

  const handleLogout = async () => {
    try{
      logOut();
    } catch (error) {
      console.log(error);
    }
    setDropDown(false)
  }

  return (
    <div className="w-full flex gap-10 justify-between items-center pb-2 bg-white dark:bg-black text-white">
      <div className="text-xl flex flex-row gap-6 items-center justify-center font-bold text-blue-500 dark:text-red-500">
        <button className="h-6 w-6 bg-red-600" onClick={() => setSidebar(!sideBar)}></button>
        <div>AmFOSS Bot.</div>
      </div>
      <div className="flex flex-row items-center justify-center gap-10">
        {user ? (
          <div className="relative group">
            <button className="font-semibold" onClick={() => setDropDown(!dropDown)}>Welcome, {user ? user.displayName.split(' ')[0] : "Guest"}</button>
            {dropDown && (
              <div className="absolute left-0 w-28 mt-2 p-2 bg-white rounded-lg shadow-md group-hover:scale-100">
                <button onClick={handleLogout} className="block w-full text-left">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleSignIn} className="font-semibold">Login</button>
        )}
        <button className="relative inline-block text-lg group" onClick={() => handleThemeChange()}>
          theme change
        </button>
      </div>

    </div>
  )
}

export default TopBar;
