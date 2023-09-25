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
                <div className="typewriter bg-gray-50 shadow-xl rounded-xl w-full py-8 p-2 px-6">
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
            <div className="dark:bg-[#131314] max-h-min flex w-5/6 flex-row p-6 gap-5">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
                <div className="typewriter bg-gray-50 shadow-xl break-words rounded-xl w-full py-4 p-2 px-6">
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
            <div className="bg-transparent w-full mt-8 max-h-min text-indigo-700 break-words flex  flex-row-reverse px-2 gap-2">
                {user ? <Image src={user.photoURL} alt={"oops image not found"} width={40} height={35} className="max-h-min rounded-full" /> : <span className="font-extrabold border-2 p-3 max-h-11 align-baseline rounded-full"><AiOutlineUser className="" /></span>}
                <span className="border break-words w-3/4 border-gray-400/50  ml-4 py-2 px-6 dark:border-white/70 rounded-xl align-baseline">
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
        <div className="bg-white items-center my-auto border-2 px-auto w-full dark:bg-black transition-all ease-in-out h-screen  pt-3 overflow-hidden flex no-scrollbar flex-col">
            <button onClick={() => {setToggle(!toggle)}} className=" text-sm p-2 m-4 rounded-full  text-white r shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium  text-center  mb-2 ">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M8 12H8.009M11.991 12H12M15.991 12H16" stroke="#1C274C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div className="flex flex-row flex-grow h-full no-scrollbar  text-white">
                <div className={`bg-white ease-in-out dark:bg-black w-full no-scrollbar flex-grow overflow-hidden transition-all `}>
                    {/*<TopBar setSidebar={setHistorySideBar} sideBar={historySideBar}/>*/}
                    <div className={`border-2 max-w-lg ${ !toggle ? 'w-0 h-0 opacity-0' : 'w-full h-[calc(75vh-5rem)] opacity-100' } rounded-3xl transition-all duration-300 ease-in-out no-scrollbar text-black dark:text-white dark:bg-[#222327] flex flex-col h-[calc(75vh-5rem)] overflow-hidden`}>
                        <div ref={chat} className={`rounded-2xl flex-grow custom-scrollbar  overflow-y-auto transition-all ease-in-out duration-300`}>
                            <div className="sticky z-30 top-0 w-full px-6 p-4 text-center text-2xl max-h-20 font-bold bg-white">
                                GE-Chatbot
                            </div>
                            <div className="h-full rounded-3xl flex flex-col items-center justify-center ">
                                <div className="flex mt-96 flex-row">
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Google_Bard_logo.svg" alt={"oops image not found"} width={30} height={30} />
                                    <p className="text-2xl font-bold text-black px-3">
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
                                            className=" mx-auto"
                                        >
                                            <Option value="dog">English</Option>
                                            <Option value="cat">French</Option>
                                            <Option value="fish">German</Option>
                                            <Option value="bird">Russian</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            {/* CHAT SECTION */}
                            {messages.map((MessageComponent, index) =>
                                React.cloneElement(MessageComponent, { key: index })
                            )}
                        </div>
                        <div className="flex mx-auto px-3 w-full pb-3 flex-col">
                            <form className="w-full flex flex-row gap-2" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    className="w-full outline-none border border-gray-400/50 dark:border-white/70 px-6 py-1 dark:bg-gray-700 rounded-xl text-md dark:text-white dark:placeholder:text-white/90 focus:border-blue-300 hover:border-white"
                                    placeholder="Post your question here"
                                    value={message}
                                    onChange={handleMessageChange}
                                />
                                <button type="submit" className="text-sm px-4 py-2 rounded-full text-white bg-gradient-to-b from-indigo-500 via-indigo-600 to-blue-700 hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium  text-center  mb-2 ">
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
