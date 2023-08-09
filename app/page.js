"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopBar from '@/components/topbar'
import { collection, doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '@/app/firebase'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import { BiMessageSquareError } from 'react-icons/bi'
import { AiOutlineUser } from 'react-icons/ai'

export default function Home() {

  const { user } = UserAuth();
  const [historySideBar, setHistorySideBar] = useState(true);
  const [historyMsg, setHistoryMsg] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const chat = useRef(null);

  useEffect(() => {
    if(chat.current) {
      const lastMessageElement = chat.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    getMessages(user).then(msg => setHistoryMsg(msg))
  }, [user]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

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
    console.log(userDocRef);
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
          console.log("First message added");
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


  const addBlobMessage = (blobText) => {
    setMessages(oldMessages => [
      ...oldMessages,
      <BlobMessage message={blobText} />,
      <BotMessage message={blobText} />
    ]);
  };

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

  // utils
  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
  }

  return (
    <div className="bg-white dark:bg-black h-screen w-full p-5 overflow-hidden flex no-scrollbar flex-col">
      <TopBar setSidebar={setHistorySideBar} sideBar={historySideBar} />
      <div className="flex flex-row flex-grow h-full no-scrollbar text-white">
        <div className={`bg-black text-white transition-all py-2 duration-300 no-scrollbar ease-in-out ${historySideBar ? 'w-3/12' : 'w-0'}`}>
          <Sidebar messages={historyMsg ? historyMsg : false} selection={handleSuggestionSubmit} state={historySideBar} setMessages={setMessages}/>
        </div>
        <div className={`bg-black w-full p-2 no-scrollbar flex-grow overflow-hidden ${historySideBar ? 'pr-12' : 'pr-16'} transition-all ${historySideBar ? 'pl-10' : 'pl-16'} `}>
          <div className="w-full rounded-3xl no-scrollbar bg-[#222327] flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
            <div ref={chat} className={`rounded-3xl flex-grow custom-scrollbar overflow-y-auto ${historySideBar ? 'pl-5' : 'pl-20'} ${historySideBar ? 'pr-8' : 'pr-20'} py-6 transition-all ease-in-out duration-300`}>
              {/* CHAT SECTION */}
              {messages.map((MessageComponent, index) =>
                React.cloneElement(MessageComponent, { key: index })
              )}
            </div>
            <div className="flex items-center justify-center pb-6">
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
