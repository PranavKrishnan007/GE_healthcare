"use client";

import { UserAuth } from '@/app/context/AuthContext'
import { useEffect, useState } from 'react'
import { db } from '@/app/firebase'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

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
  const { user } = UserAuth();
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

  const handleSuggestionChange = (e) => {
    setSuggestion(e.target.value);
  }

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  }

  return (
    <div className="flex flex-col">
      <h1>Admin Page</h1>
      {user?.email === "pranavk0217@gmail.com" ? (
        <div className="flex flex-col w-full">
          {suggestionList.suggestions?.map((suggestion, index) => (
            <div key={index} className="flex flex-row w-full justify-between">
              <div className="flex flex-row">
                <div className="">{suggestion.suggestion}</div>
                <div className="">{suggestion.answer}</div>
              </div>
              <div>
                <button className="bg-blue-300" onClick={() => handleSuggestionRemoval(index)}>Remove</button>
              </div>
            </div>
          ))
          }
          <div className="flex flex-row w-full">
            <input type="text" placeholder="Question" className="w-1/2" value={suggestion} onChange={(e) => handleSuggestionChange(e)} />
            <input type="text" placeholder="Answer" className="w-1/2" value={answer} onChange={(e) => handleAnswerChange(e)} />
          </div>
          <div className="flex flex-row gap-5">
            <button className="bg-red-400" onClick={() => handleAddSuggestionClick(suggestion, answer)}>Add Suggestion</button>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-screen justify-center items-center text-center">Not Authorized</div>
      )}
    </div>
  );
}

export default Admin;
