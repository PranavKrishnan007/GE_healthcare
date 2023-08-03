"use client";

import { useEffect, useState, useRef } from 'react';
import React from 'react';
import TopBar from '@/components/topbar'
import { collection, doc, getDoc, getDocs, where, query, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '@/app/firebase'
import { UserAuth } from '@/app/context/AuthContext'

export default function Home() {

  const { user } = UserAuth()
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
      <span key={index} style={{animationDelay: index * 0.05 + 's'}}>{char}</span>
    ));

    return (
      <div className="msg left-msg">
        <div
          className="msg-img"
          style={{ backgroundImage: "url(https://image.flaticon.com/icons/svg/327/327779.svg)" }}
        ></div>

        <div className="msg-bubble">
          <div className="msg-info">
            <div className="msg-info-name">BOT</div>
            <div className="msg-info-time">{formatDate(new Date())}</div>
          </div>

          <div className="msg-text typewriter">
            {typing}
          </div>
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

  // function BlobMessage({ message }) {
  //   const typing = message.split('').map((char, index) => (
  //     <span key={index} style={{animationDelay: index * 0.1 + 's'}}>{char}</span>
  //   ));
  //
  //   return (
  //     <div className="msg right-msg">
  //       <div className="msg-img"
  //            style={{backgroundImage: 'url(https://image.flaticon.com/icons/svg/145/145867.svg)'}}
  //       ></div>
  //
  //       <div className="msg-bubble">
  //         <div className="msg-info">
  //           <div className="msg-info-name">Someone</div>
  //           <div className="msg-info-time">{formatDate(new Date())}</div>
  //         </div>
  //
  //         <div className="msg-text typewriter">
  //           {typing}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
  function BlobMessage({ message }) {
    return (
      <div className="msg right-msg">
        <div
          className="msg-img"
          style={{ backgroundImage : `url(https://image.flaticon.com/icons/svg/145/145867.svg)`}}
        ></div>

        <div className="msg-bubble">
          <div className="msg-info">
            <div className="msg-info-name">Someone</div>
            <div className="msg-info-time">{formatDate(new Date())}</div>
          </div>

          <div className="msg-text">
            {message}
          </div>
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
    <div className="h-screen relative w-full overflow-hidden flex flex-col items-center justify-center">
      <TopBar/>
      <section className="msger h-full">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> amFOSS Bot
          </div>
          <div className="msger-header-options">
            <span><i className="fas fa-cog"></i></span>
          </div>
        </header>

        <main className="msger-chat" ref={msgerChat}>
          <div className="msg left-msg">
            <div
              className="msg-img"
              style={{backgroundImage : "url(https://image.flaticon.com/icons/svg/327/327779.svg)"}}
            ></div>

            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">BOT</div>
                <div className="msg-info-time">12:45</div>
              </div>

              <div className="msg-text">
                Hi, welcome to amFOSS Bot. 😄
              </div>
            </div>
          </div>

          {/*<div className="msg right-msg">*/}
          {/*  <div*/}
          {/*    className="msg-img"*/}
          {/*    style={{backgroundImage : "url(https://image.flaticon.com/icons/svg/145/145867.svg)"}}*/}
          {/*  ></div>*/}

          {/*  <div className="msg-bubble">*/}
          {/*    <div className="msg-info">*/}
          {/*      <div className="msg-info-name">Sajad</div>*/}
          {/*      <div className="msg-info-time">12:46</div>*/}
          {/*    </div>*/}

          {/*    <div className="msg-text">*/}
          {/*      You can change your name in JS section!*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {messages.map((MessageComponent, index) =>
            React.cloneElement(MessageComponent, { key: index })
          )}
        </main>
        <div className="flex flex-row items-center justify-center gap-2 p-4">
          <div>Suggestions</div>
          <button
            className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"
            onClick={() => handleSuggestionSubmit("amrita")}>
            amrita
          </button>
          <button
            className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"
            onClick={() => handleSuggestionSubmit("amfoss")}>
            amfoss
          </button>
          <button
            className="p-2 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out"
            onClick={() => handleSuggestionSubmit("registration")}>
            registration
          </button>
        </div>
        <div className="flex flex-row w-full gap-10">
          <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={() => setFireMessage(user)}>get user</button>
          <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={() => updateFireMessage(message, user)}>update Messages</button>
          <button className="w-1/3 p-4 bg-red-300 rounded-2xl hover:bg-red-400 transition duration-300 ease-in-out" onClick={getMessages}>get Messages</button>
        </div>

        <form className="msger-inputarea" onSubmit={handleSubmit}>
          <input type="text" className="msger-input" placeholder="Enter your message..." value={message} onChange={handleMessageChange}/>
          <button type="submit" className="msger-send-btn">Send</button>
        </form>
      </section>
    </div>
  )
}
