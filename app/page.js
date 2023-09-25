"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopBar from '@/components/topbar/topbar'
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '@/app/firebase'
import { UserAuth } from '@/app/context/AuthContext'
import Image from 'next/image'
import Sidebar from '@/components/sidebar'
import { AiOutlineUser } from 'react-icons/ai'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { getSuggestions } from '@/app/admin/page'
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Select, { selectClasses } from '@mui/joy/Select';
import Preloader from "@/components/preloader/preloader";
import logo from '@/assets/AI Avatar.svg';


const setToggle = (b) => {

};
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
  const [selectedValue, setSelectedValue] = useState('');
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if(chat.current) {
      const lastMessageElement = chat.current.lastElementChild;
      if (lastMessageElement) lastMessageElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    getMessages(user).then(msg => setHistoryMsg(msg))
    getSuggestions().then((suggestions) => setSuggestionList(suggestions));
    checkEnrollment(user).then(val => setCongrats(val))
  }, [user]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };


  async function sendChatQuery(userInput) {
    try {
      const response = await fetch('https://dialogflow-amfoss-server.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput }), // Pass the request body here
      });

      const data = await response.json();
      console.log('Response from chat API:', data);
      return data; // Return the response data
    } catch (error) {
      console.error('Error:', error);
      throw error; // Throw the error to be handled by the calling function
    }
  }

  const checkEnrollment = async (user) => {
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
      <div className="dark:bg-[#131314] mx-auto max-h-min w-5/6  rounded-3xl flex flex-row p-6 gap-5">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
        <div className="typewriter bg-gray-50 dark:bg-[#252525] dark:shadow-[#070707] dark:shadow-2xl shadow-xl rounded-xl w-full py-8 p-2 px-6">
          {typing}
        </div>
      </div>
    );
  }

  let isCalled = false;

  function BotMessage ({ message }) {
    const [botResponse, setBotResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchBotResponse = async () => {
        const response = await BotResponse(message);
        setBotResponse(response);
        setIsLoading(false);
      };

      fetchBotResponse();
    }, []);

    const typing = botResponse.split('').map((char, index) => (
      <span key={index} style={{ animationDelay: index * 0.03 + 's' }}>{char}</span>
    ));

    return (
      <div className="dark:bg-[#131314] mx-auto max-h-min flex w-5/6 flex-row p-6 gap-5">
        <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
        <div className="typewriter bg-gray-50 shadow-xl dark:bg-[#252525] dark:shadow-[#070707] dark:shadow-2xl  rounded-xl w-full py-8 p-2 px-6">
          {isLoading ?
            <div className="bouncing-loader">
              <div></div>
              <div></div>
              <div></div>
            </div>
            :
            typing
          }
        </div>
      </div>
    );
  }

  async function BotResponse(message) {
    if (isCalled) {
      return;
    }
    isCalled = true;
    const text = message.toLowerCase();
    try {
      const res = await sendChatQuery(text);
      if (res) {
        console.log("message from the server - botResponse" +res.response);
        isCalled = false;
        return res.response;
      }
    } catch (error) {
      return "Sorry, the bot is not functioning right now. Please try again later or you can choose from the suggestions options given below."
    }
  }

  function BlobMessage({ message }) {
    return (
      <div className="bg-transparent mx-auto w-5/6 mt-52 max-h-min  flex flex-row  px-6 gap-2">
        {user ? <Image src={user.photoURL} alt={"oops image not found"} width={40} height={35} className="rounded-full" /> : <span className="font-extrabold border-2 p-3 align-baseline rounded-full"><AiOutlineUser className="" /></span>}
        <span className="border border-gray-400/50 dark:bg-[#252525] border-[#DCC3F9] w-full py-2 px-6 dark:border-white/70 rounded-xl align-baseline">
          {message}
        </span>
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
    <div className="bg-white dark:dark:bg-[#121314] dark:text-white h-screen w-full  overflow-hidden flex no-scrollbar flex-col">
      {/*<div className={`absolute ${ toggle ? 'h-0 opacity-0 z-0 hidden transition-all duration-300' : '' } justify-center items-center flex  bg-indigo-600 min-h-[100%] w-full z-50`}*/}
      {/*     style={{*/}
      {/*         }}>*/}
      {/*  <button onClick={() => {setToggle(!toggle)}} className=" px-4 p-2 m-4 rounded-lg bg-gray-800 text-white  shadow-lg shadow-gray-800 dark:shadow-lg dark:shadow-blue-800/80 text-2xl  text-center  mb-2 ">*/}
      {/*   Try now*/}
      {/*  </button>*/}
      {/*</div>*/}
      <Preloader />
      <div>

      </div>
      <div className="flex flex-row dark:bg-[#121314] flex-grow h-full no-scrollbar pt-2 text-white">
        <div className={`dark:text-white dark:shadow-[#000000] shadow-2xl shadow-[#D6C7E7]  text-white transition-all  duration-300 no-scrollbar ease-in-out ${historySideBar ? 'w-3/12 z-20' : 'w-0'}`}>
          <Sidebar messages={historyMsg ? historyMsg : false} selection={handleSuggestionSubmit} state={historySideBar} setMessages={setMessages} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className={`ease-in-out w-full p-2 no-scrollbar flex-grow overflow-hidden ${historySideBar ? 'pr-12' : 'pr-16'} transition-all ${historySideBar ? 'pl-10' : 'pl-16'} `}>
          <TopBar setSidebar={setHistorySideBar} sideBar={historySideBar}/>
          {isOpen && (
            <div className="w-screen h-screen z-40 fixed top-0 right-0 backdrop-blur-2xl flex items-center justify-center">
              <div className="p-10 transition-all ease-in-out bg-white dark:bg-black shadow-2xl rounded-3xl flex flex-col relative items-center justify-center gap-4">
                {/*<Image src={logo} alt={"oops image not found"} width={50} height={50} />*/}
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
                )}n
              </div>
            </div>
          )}
          <div className="w-full  no-scrollbar text-black  dark:text-white bg-transparent flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
            <div ref={chat} className={`rounded-3xl flex-grow custom-scrollbar overflow-y-auto ${historySideBar ? 'pl-5 pr-8' : 'px-20'} py-6 transition-all ease-in-out duration-300`}>
                <div className="h-full rounded-3xl flex  flex-col items-center justify-center p-6 gap-5">
                  <div className="flex mt-96 flex-row">
                    <Image src={logo} alt={"oops image not found"} width={35} height={35} />
                    <p className="text-2xl dark:text-white  font-bold text-black px-3">
                      BLEH
                    </p>
                  </div>
                  <div className="typewriter w-3/4 text-center mb-96">
                    Seeking reliable healthcare information, immediate assistance, or simply a trusted friend to guide you
                    on your wellness journey? Look no further – meet HealthAssist Bot,
                    <div className="mt-8">
                      <Select
                          placeholder="Select this"
                          indicator={<KeyboardArrowDown />}
                          size="lg"
                          sx={{
                            width: 240,
                            [`& .${selectClasses.indicator}`]: {
                              transition: '0.2s',
                              [`&.${selectClasses.expanded}`]: {
                                transform: 'rotate(-180deg)',
                              },
                            },
                          }}
                          className="dark:bg-[#121314] dark:text-white mx-auto"
                      >
                        <Option value="dog">English</Option>
                        <Option value="cat">German</Option>
                        <Option value="fish">French</Option>
                        <Option value="bird">Russian</Option>
                      </Select>

                    </div>
                  </div>
                  {/*<div className="">*/}
                  {/*  <select*/}
                  {/*      id="mySelect"*/}
                  {/*      value={selectedValue}*/}
                  {/*      onChange={handleSelectChange}*/}
                  {/*      className="border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-300 mb-20 p-4 mx-2 bg-transparent  border-gray-300 shadow-xl ">*/}
                  {/*    <option value="" > Select language </option>*/}
                  {/*    <option value="option1" style={{borderRadius: '99px', padding: '0.5rem 1rem'}} >Option 1</option>*/}
                  {/*    <option value="option2" style={{borderRadius: '9px', padding: '0.5rem 1rem'}} >Option 2</option>*/}
                  {/*    <option value="option3" style={{borderRadius: '99px', padding: '0.5rem 1rem'}} >Option 3</option>*/}
                  {/*  </select>*/}
                  {/*</div>*/}
                </div>
              {/* CHAT SECTION */}
              {messages.map((MessageComponent, index) =>
                React.cloneElement(MessageComponent, { key: index })
              )}
            </div>
            <div className="flex items-center mx-auto w-2/3 justify-center pb-6 flex-col">
              <div className={`carousel-container custom-scrollbar ${historySideBar ? 'pl-5 pr-8' : 'px-20'} transition-all pb-3 ease-in-out duration-300`}>
                <div className="carousel custom-scrollbar" ref={carouselRef}>
                  {suggestionList?.suggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      className="carousel-item whitespace-nowrap w-full text-black dark:text-white px-4 py-2 glow-button" // Added "glow-button" class
                      onClick={() => addBlobSuggestion(suggestion)}
                    >
                      {suggestion.suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <form className="w-full flex flex-row items-center justify-center gap-6" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="w-full outline-none border border-gray-400/50 dark:border-white/70 px-10 py-2 dark:bg-[#121314] rounded-full text-md dark:text-white dark:placeholder:text-white/90 focus:border-blue-300 hover:border-white"
                  placeholder="Post your question here"
                  value={message}
                  onChange={handleMessageChange}
                />
                <button type="submit" className="text-lg px-12 rounded-full text-white bg-gradient-to-b from-indigo-500 via-indigo-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium  py-2 text-center mr-2 mb-2 ">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
