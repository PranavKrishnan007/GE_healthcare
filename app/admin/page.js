"use client";

import { useEffect, useState } from 'react'
import { db } from '@/app/firebase'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import TopBar from '@/components/topbar'

export const getSuggestions = async () => {
  try {
    const docRef = doc(db, "data", "suggestions");
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch {
    console.log("error");
  }
}

const Admin = () => {
  const [authorised, setAuthorised] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [suggestionList, setSuggestionList] = useState({});
  const [suggestion, setSuggestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    getSuggestions().then((suggestions) => setSuggestionList(suggestions));
  }, [])

  const handleSuggestionRemoval = async (index) => {
    const newSuggestions = [...suggestionList.suggestions];
    newSuggestions.splice(index, 1);
    const docRef = doc(db, "data", "suggestions");
    try {
      await updateDoc(docRef, {
        "suggestions": newSuggestions
      });
      setSuggestionList({suggestions: newSuggestions});
    } catch (error) {
      console.log("Error updating document: ", error);
    }
  }

  const handleAddSuggestionClick = async (suggestion, answer) => {
    const docRef = doc(db, "data", "suggestions");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        try {
          await updateDoc(docRef, {
            "suggestions": arrayUnion({ suggestion: suggestion, answer: answer })
          });
        } catch {
          console.log("error");
        }
      } else {
        try {
          await setDoc(docRef, { suggestions: [{ suggestion: suggestion, answer: answer }] });
        } catch (error) {
          console.log("error");
        }
      }
      setSuggestionList(await getSuggestions());
      setSuggestion('');
      setAnswer('');
    } catch (error) {
      console.log(error);
    }
  }

  const handleUsernameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (userName === "AmFOSS_ChatBoT" && password === "AaSOFmto_SCBhT") {
      setAuthorised(true);
    } else {
      alert("Wrong username or password");
    }
    setPassword('');
    setUserName('');
  };

  const handleSuggestionChange = (e) => {
    setSuggestion(e.target.value);
  }

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  }

  return (
    <div className="w-screen h-screen">
      <TopBar admin={true}/>
      <div className="dark:bg-black dark:text-white flex flex-col h-full py-2 px-4">
        <h1 className="text-xl text-center dark:text-gray-100">Admin Page</h1>
        {authorised ? (
          <div className="p-5 bg-white dark:bg-black transition-all ease-in-out rounded shadow-sm w-full">
            {suggestionList.suggestions?.map((suggestion, index) => (
              <div key={index} className="flex flex-row w-full justify-between mb-2">
                <div className="flex flex-row space-x-4">
                  <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">{suggestion.suggestion}</div>
                  <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">{suggestion.answer}</div>
                </div>
                <div>
                  <button className="dark:bg-red-500 bg-red-300 text-white rounded p-1" onClick={() => handleSuggestionRemoval(index)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="flex flex-col w-full">
              <input type="text" placeholder="Question" className="dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded p-1 mb-2 w-full" value={suggestion} onChange={(e) => handleSuggestionChange(e)} />
              <input type="text" placeholder="Answer" className="dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded p-1 mb-2 w-full" value={answer} onChange={(e) => handleAnswerChange(e)} />
            </div>
            <div className="flex flex-row gap-5">
              <button className="w-full dark:bg-blue-500 bg-blue-300 text-white rounded p-2 mt-2" onClick={() => handleAddSuggestionClick(suggestion, answer)}>Add Suggestion</button>
            </div>
          </div>
        ) : (
          <div className="flex w-full h-screen justify-center items-center text-center">
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-field"
                placeholder="Username"
                value={userName}
                onChange={handleUsernameChange}
              />
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              <button type="submit" className="submit-button">Sign in</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
