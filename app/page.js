"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopBar from '@/components/topbar'
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '@/app/firebase'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import { AiOutlineUser } from 'react-icons/ai'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { getSuggestions } from '@/app/admin/page'

export default function Home() {

  const { user } = UserAuth();
  const [historySideBar, setHistorySideBar] = useState(true);
  const carouselRef = useRef();
  const [suggestionList, setSuggestionList] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [historyMsg, setHistoryMsg] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chat = useRef(null);
  console.log(suggestionList);

  useEffect(() => {
    if(chat.current) {
      const lastMessageElement = chat.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    getMessages(user).then(msg => setHistoryMsg(msg))
    getSuggestions().then((suggestions) => setSuggestionList(suggestions));
    checkEnrollment(user).then(val => setCongrats(val))
  }, [user]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const checkEnrollment = async (user) => {
    console.log("enrollment is being called.")
    console.log(user);
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      const data = userDocSnapshot.data();
      return data.registered !== undefined;
    } catch (error) {
      console.error("Error checking document:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!message) return;
    {user && updateFireMessage(message, user).then(() => getMessages(user).then(msg => setHistoryMsg(msg)));}
    addBlobMessage(message);
    setMessage('');
  }

  const getMessages = async (user) => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      }
      else {
        console.log("No such document!");
      }
      const data = docSnap.data();
      return data.messages; // Accessing messages from the data.
    } catch {
      console.log("oopsieee")
    }
  }

  const updateFireMessage = async (message, user) => {
    const userDocRef = doc(db, "users", user.uid); // Updated line here
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        try {
          await updateDoc(userDocRef, {
            messages: arrayUnion(message),
          });
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        try {
          await setDoc(userDocRef, { messages: [message] }); // Use setDoc instead of addDoc for updating or adding the document
        } catch (error) {
          console.error("Error adding document:", error);
        }
      }
    } catch (error) {
      console.error("Error checking document:", error);
    }
  };

  const handleSuggestionSubmit = async (suggestion) => {
    await setMessage(suggestion);
  }

  const addBlobSuggestion = (suggestion) => {
    setMessages(oldMessages => [
      ...oldMessages,
      <BlobMessage message={suggestion.suggestion} />,
      <BotSuggestionMessage message={suggestion.answer} />
    ]);
  }

  const addBlobMessage = (blobText) => {
    setMessages(oldMessages => [
      ...oldMessages,
      <BlobMessage message={blobText} />,
      <BotMessage message={blobText} />
    ]);
  };

  function BotSuggestionMessage ({ message }) {
    const typing = message.split('').map((char, index) => (
      <span key={index} style={{animationDelay: index * 0.01 + 's'}}>{char}</span>
    ));

    return (
      <div className="bg-[#131314] max-h-min rounded-3xl flex flex-row p-6 gap-5">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
        <div className="typewriter">
          {typing}
        </div>
      </div>
    );
  }

  function BotMessage ({ message }) {
    const botResponse = BotResponse(message);
    const typing = botResponse.split('').map((char, index) => (
      <span key={index} style={{animationDelay: index * 0.03 + 's'}}>{char}</span>
    ));

    return (
      <div className="bg-[#131314] max-h-min rounded-3xl flex flex-row p-6 gap-5">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
        <div className="typewriter">
          {typing}
        </div>
      </div>
    );
  }

  function BotResponse(message) {
    const text = message.toLowerCase();
    if(text.includes("registration")) {
      return "Registration link: https://amfoss.in";
    }
    if(text.includes("hi") || text.includes("hello") || text.includes("hey")) {
      return "Hi, welcome to amFOSS Bot. 😄";
    }
    if(text.includes("amfoss")) {
      return "amFOSS is a student-run community that aims to promote open-source software. 😄";
    }
    if(text.includes("amrita")) {
      return "Amrita Vishwa Vidyapeetham is a private deemed-to-be-university located in Coimbatore, Tamil Nadu, India. 😄";
    }
    return message;
  }

  function BlobMessage({ message }) {
    return (
      <div className="bg-transparent max-h-min rounded-3xl flex flex-row p-6 gap-5">
        {user ? <Image src={user.photoURL} alt={"oops image not found"} width={30} height={30} className="rounded-full" /> : <span className="font-extrabold border-2 p-2 rounded-full"><AiOutlineUser className="" /></span>}
        <div className="">
          {message}
        </div>
      </div>
    );
  }

  const registryComplete = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        registered: true,
        name: user.displayName,
        email: user.email
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
    setCongrats(true);
    setIsOpen(!isOpen);
  }


  const handleDiscordSend = async (user) => {
    fetch("https://discord.com/api/webhooks/1138864626503794688/hYE8ORxSxCca51Lej_cdFwjvwEF8-8a8uoHkQMMEopcuTAQlFd8ZBnfd7Ec32DUwGgV_", {
      body: JSON.stringify({
        content: `Enrollment Details : Name - ${user.displayName}, Email - ${user.email}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then(function (res) {
        registryComplete(user)
      })
      .catch(function (res) {
        console.log(res);
      });
  }

  return (
    <div className="bg-white dark:bg-black h-screen w-full p-5 overflow-hidden flex no-scrollbar flex-col">
      <TopBar setSidebar={setHistorySideBar} sideBar={historySideBar} />
      <div className="flex flex-row flex-grow h-full no-scrollbar text-white">
        <div className={`bg-black text-white transition-all py-2 duration-300 no-scrollbar ease-in-out ${historySideBar ? 'w-3/12' : 'w-0'}`}>
          <Sidebar messages={historyMsg ? historyMsg : false} selection={handleSuggestionSubmit} state={historySideBar} setMessages={setMessages} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className={`bg-black w-full p-2 no-scrollbar flex-grow overflow-hidden ${historySideBar ? 'pr-12' : 'pr-16'} transition-all ${historySideBar ? 'pl-10' : 'pl-16'} `}>
          {isOpen && (
            <div className="w-screen h-screen z-50 fixed top-0 right-0 backdrop-blur-2xl flex items-center justify-center">
              <div className="p-10 bg-black shadow-2xl rounded-3xl flex flex-col relative items-center justify-center gap-4">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={50} height={50} />
                <button className="absolute top-3 right-3" onClick={() => setIsOpen(!isOpen)}><IoCloseCircleOutline size={20}/></button>
                <div className="text-center">
                  {congrats ? 'You will be notified when Praveshan begins' : `Do you wish to receive notifications to ${user.email}`}
                </div>
                {congrats !== true && (
                  <button className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
                  <span
                    className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                    <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </span>
                    <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                    <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white" onClick={() => handleDiscordSend(user)}>Continue</span>
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="w-full rounded-3xl no-scrollbar bg-[#222327] flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
            <div ref={chat} className={`rounded-3xl flex-grow custom-scrollbar overflow-y-auto ${historySideBar ? 'pl-5' : 'pl-20'} ${historySideBar ? 'pr-8' : 'pr-20'} py-6 transition-all ease-in-out duration-300`}>
              <div className="bg-[#131314] max-h-min rounded-3xl flex flex-row p-6 gap-5">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
                <div className="typewriter">
                  Hello! welcome to AmFOSS BOT.
                </div>
              </div>
              {/* CHAT SECTION */}
              {messages.map((MessageComponent, index) =>
                React.cloneElement(MessageComponent, { key: index })
              )}
            </div>
            <div className="flex items-center justify-center pb-6 flex-col">
              <div className="carousel-container custom-scrollbar">
                <div className="carousel custom-scrollbar" ref={carouselRef}>
                  {suggestionList.suggestions?.map((suggestion, index) => (
                    <button key={index} className="carousel-item" onClick={() => addBlobSuggestion(suggestion)}>
                      {suggestion.suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <form className="w-full flex flex-row items-center justify-center gap-6" onSubmit={handleSubmit}>
                <input type="text" className="w-10/12 outline-none bg-[#131314] border border-white/70 px-10 py-4 rounded-full text-md text-white placeholder:text-white/90  focus:border-blue-300 hover:border-white" placeholder="Post your question here" value={message} onChange={handleMessageChange}/>
                <button type="submit" className="">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
