import {useContext, createContext, useState, useEffect} from 'react'
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { auth } from '@/app/firebase'

const AuthContext = createContext(undefined, undefined)

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null)

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider).then((result) => {})
  }

  const logOut = () => {
    signOut(auth).then(() => {
      setUser(null)
    }).catch((error) => {
      console.log(error)
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    });
    return () => unsubscribe
  }, [user])

  return (<AuthContext.Provider value={{ user, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}


export const UserAuth = () => {
  return useContext(AuthContext)
}
