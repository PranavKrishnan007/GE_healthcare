"use client";

import { useEffect, useState } from 'react';
import React from 'react';

export default function Home() {

  const [message, setMessage] = useState('');
  const [user, setUser] = useState('Someone');
  const [messages, setMessages] = useState([]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if(!message) return;
    console.log(message);
    // TODO: render the component here
    addBlobMessage(message);
    setMessage('');
  }

  const addBlobMessage = (blobText) => {
    setMessages(oldMessages => [
      ...oldMessages,
      <BlobMessage message={blobText} />,
      <BotMessage message={blobText} />
    ]);
  };

  function BotMessage ({ message }) {
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

          <div className="msg-text">
            what you responded is : {message}
          </div>
        </div>
      </div>
    );
  }

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

  const handleThemeChange = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

  const BOT_MSGS = [
    "Hi, how are you?",
    "Ohh... I can't understand what you trying to say. Sorry!",
    "I like to play games... But I don't know how to play!",
    "Sorry if my answers are not relevant. :))",
    "I feel sleepy! :("
  ];

// Icons made by Freepik from www.flaticon.com
  const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
  const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
  const BOT_NAME = "BOT";
  const PERSON_NAME = "Sajad";


//   msgerForm.addEventListener("submit", event => {
//     event.preventDefault();
//
//     const msgText = msgerInput.value;
//     if (!msgText) return;
//
//     appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
//     msgerInput.value = "";
//
//     botResponse();
//   });
//
//   function appendMessage(name, img, side, text) {
//     //   Simple solution for small apps
//     const msgHTML = `
//     <div className="msg ${side}-msg">
//       <div className="msg-img" style={{backgroundImage : "url(${img})"}}></div>
//
//       <div className="msg-bubble">
//         <div className="msg-info">
//           <div className="msg-info-name">${name}</div>
//           <div className="msg-info-time">${formatDate(new Date())}</div>
//         </div>
//
//         <div className="msg-text">${text}</div>
//       </div>
//     </div>
//   `;
//
//     msgerChat.insertAdjacentHTML("beforeend", msgHTML);
//     msgerChat.scrollTop += 500;
//   }
//
//   function botResponse() {
//     const r = random(0, BOT_MSGS.length - 1);
//     const msgText = BOT_MSGS[r];
//     const delay = msgText.split(" ").length * 100;
//
//     setTimeout(() => {
//       appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
//     }, delay);
//   }
//
// // Utils
//   function get(selector, root = document) {
//     return root.querySelector(selector);
//   }
//
  function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
  }
//
//   function random(min, max) {
//     return Math.floor(Math.random() * (max - min) + min);
//   }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-500 dark:text-red-500">
        Hello world!
      </h1>
      <button className="relative inline-block text-lg group" onClick={() => handleThemeChange()}>
        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
          <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
          <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
          <span className="relative">Toggle Theme</span>
        </span>
        <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
      </button>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> SimpleChat
          </div>
          <div className="msger-header-options">
            <span><i className="fas fa-cog"></i></span>
          </div>
        </header>

        <main className="msger-chat">
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
                Hi, welcome to SimpleChat! Go ahead and send me a message. 😄
              </div>
            </div>
          </div>

          <div className="msg right-msg">
            <div
              className="msg-img"
              style={{backgroundImage : "url(https://image.flaticon.com/icons/svg/145/145867.svg)"}}
            ></div>

            <div className="msg-bubble">
              <div className="msg-info">
                <div className="msg-info-name">Sajad</div>
                <div className="msg-info-time">12:46</div>
              </div>

              <div className="msg-text">
                You can change your name in JS section!
              </div>
            </div>
          </div>
          {messages.map((MessageComponent, index) =>
            React.cloneElement(MessageComponent, { key: index })
          )}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}>
          <input type="text" className="msger-input" placeholder="Enter your message..." value={message} onChange={handleMessageChange}/>
          <button type="submit" className="msger-send-btn">Send</button>
        </form>
      </section>
    </div>
  )
}
