"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopBar from '@/components/topbar'
import { collection, doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '@/app/firebase'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'

export default function Home() {

  const { user } = UserAuth()
  const [historySideBar, setHistorySideBar] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const msgerChat = useRef(null);

  useEffect(() => {
    if(msgerChat.current) {
      const lastMessageElement = msgerChat.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!message) return;
    addBlobMessage(message);
    setMessage('');
  }

  const getMessages = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    }
    else {
      console.log("No such document!");
    }
  }

  const setFireMessage = async (user) => {
    // Get the Firestore document for the authenticated user's uid
    const userDocRef = doc(collection(db, "users"), user.uid);
    console.log(user.uid)
    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        console.log("exists");
        // Do something if the document exists
      } else {
        console.log("not exists");
        // Do something if the document does not exist
      }
    } catch (error) {
      console.error("Error checking document:", error);
    }
  };

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
    handleSubmit({ preventDefault: () => {} });
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
        <Image src={user.photoURL} alt={"oops image not found"} width={30} height={30} className="rounded-full" />
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
    // <div className="w-full h-screen flex flex-col">
    //   <div className="flex flex-row flex-grow">
    //     <div className="w-1/5 h-full">hello world</div>
    //     <div className="w-4/5 h-full relative">
    //       <TopBar/>
    //       <section className="msger flex flex-col w-full h-full">
    //         <main className="msger-chat flex flex-col overflow-auto" ref={msgerChat}>

    //
    //           {/*<div className="msg right-msg">*/}
    //           {/*  <div*/}
    //           {/*    className="msg-img"*/}
    //           {/*    style={{backgroundImage : "url(https://image.flaticon.com/icons/svg/145/145867.svg)"}}*/}
    //           {/*  ></div>*/}
    //
    //           {/*  <div className="msg-bubble">*/}
    //           {/*    <div className="msg-info">*/}
    //           {/*      <div className="msg-info-name">Sajad</div>*/}
    //           {/*      <div className="msg-info-time">12:46</div>*/}
    //           {/*    </div>*/}
    //
    //           {/*    <div className="msg-text">*/}
    //           {/*      You can change your name in JS section!*/}
    //           {/*    </div>*/}
    //           {/*  </div>*/}
    //           {/*</div>*/}

    //         </main>
    //         {/*<div className="flex flex-row items-center justify-center gap-2 p-4">*/}
    //         {/*  <div>Suggestions</div>*/}
    //         {/*  <button*/}
    //         {/*    className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"*/}
    //         {/*    onClick={() => handleSuggestionSubmit("amrita")}>*/}
    //         {/*    amrita*/}
    //         {/*  </button>*/}
    //         {/*  <button*/}
    //         {/*    className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"*/}
    //         {/*    onClick={() => handleSuggestionSubmit("amfoss")}>*/}
    //         {/*    amfoss*/}
    //         {/*  </button>*/}
    //         {/*  <button*/}
    //         {/*    className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"*/}
    //         {/*    onClick={() => handleSuggestionSubmit("registration")}>*/}
    //         {/*    registration*/}
    //         {/*  </button>*/}
    //         {/*</div>*/}
    //         {/*<div className="flex flex-row w-full gap-10">*/}
    //         {/*  <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={() => setFireMessage(user)}>get user</button>*/}
    //         {/*  <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={() => updateFireMessage(message, user)}>update Messages</button>*/}
    //         {/*  <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={getMessages}>get Messages</button>*/}
    //         {/*</div>*/}
    //

    //       </section>
    //     </div>
    //   </div>
    // </div>
    <div className="bg-white dark:bg-black h-screen w-full p-5 overflow-y-hidden flex flex-col">
      <TopBar setSidebar={setHistorySideBar} sideBar={historySideBar} />
      {/* section containing the history sidebar and main chat section. */}
      <div className="flex flex-row text-white flex-grow">
        {/* left side */}
        <div className={`bg-black text-white transition-all py-2 duration-300 ease-in-out ${historySideBar ? 'w-3/12' : 'w-0'}`}>
          <div className="rounded-full px-3 py-1 bg-gray-500/30 max-w-min">History</div>
        </div>
        {/*right side */}
        <div className={`bg-black w-full p-2 flex-grow ${historySideBar ? 'pr-12' : 'pr-16'} transition-all ${historySideBar ? 'pl-10' : 'pl-16'} `}>
          <div className="w-full h-full rounded-3xl bg-[#222327] flex flex-col">
            <div className={`rounded-3xl flex-grow ${historySideBar ? 'pl-5' : 'pl-20'} ${historySideBar ? 'pr-8' : 'pr-20'} py-6 transition-all ease-in-out duration-300`}>
              {/* to be iterated over and over again. */}
              <div className="bg-[#131314] max-h-min rounded-3xl flex flex-row p-6 gap-5">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={20} />
                <div className="">
                  Hi, welcome to amFOSS Bot. 😄
                </div>
              </div>
              {messages.map((MessageComponent, index) =>
                React.cloneElement(MessageComponent, { key: index })
              )}
            </div>
            <div className="max-h-min sticky flex items-center justify-center bottom-0 pt-2 pb-6">
              <form className="sticky bottom-0 w-full flex flex-row items-center justify-center gap-6" onSubmit={handleSubmit}>
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
