import React, { useState } from 'react'
import { UserAuth } from '@/app/context/AuthContext'

const TopBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // assuming user is not loggedIn initially
  const [dropDown, setDropDown] = useState(false);
  const { user, googleSignIn, logOut } = UserAuth();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      setIsLoggedIn(true);
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
    // this is where you'd implement your logout logic,
    // for this example, I'll just simulate a logout event.
    try{
      logOut();
    } catch (error) {
      console.log(error);
    }
    setIsLoggedIn(false);
    setDropDown(false)
  }

  return (
    <div className="z-50 sticky top-0 flex gap-10 justify-between items-center p-5 bg-white dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-blue-500 dark:text-red-500">
        AmFOSS Bot.
      </h1>
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
        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
          <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
          <span className="relative">Toggle Theme</span>
        </span>
        <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
      </button>
    </div>
  )
}

export default TopBar;
