"use client";

import { useEffect, useState } from 'react'
import { db } from '@/app/firebase'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import TopBar from '@/components/topbar/topbar'
import axios from "axios";
import {
  AiOutlineCloudUpload,
  AiOutlineFileAdd,
  AiOutlineShoppingCart,
  AiOutlineCheckCircle,
} from "react-icons/ai";


export const getSuggestions = async () => {
  try {
    const docRef = doc(db, "data", "suggestions");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    return data || { suggestions: [] }; // Provide a default if data is undefined
  } catch (error) {
    console.log("Error getting suggestions: ", error);
    return { suggestions: [] }; // Handle the error and provide a default value
  }
}

const Admin = () => {
  const [authorised, setAuthorised] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [suggestionList, setSuggestionList] = useState({ suggestions: [] });

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

    if (userName === "admin" && password === "admin") {
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

   const [selectedFile, setSelectedFile] = useState(null);
   const [fileName, setFileName] = useState("Not selected file");
   const [fileSelected, setFileSelected] = useState(false);

   const handleFileChange = (event) => {
     const file = event.target.files[0];
     setSelectedFile(file);
     setFileName(file.name);
     setFileSelected(true);
   };

   const handleUpload = async () => {
     const formData = new FormData();
     formData.append("file", selectedFile);

     try {
       const response = await axios.post("/api/upload", formData, {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       });
       console.log(response.data);
     } catch (error) {
       console.error("Error:", error);
     }
   };
  return (
    <div className="h-full ">
      <TopBar admin={true} />
      <div className="dark:bg-black dark:text-white ">
        <div className="container mx-auto flex flex-col p-8 justify-center items-center ">
          <h1 className="text-3xl font-medium text-center dark:text-gray-100 pb-16">
            Admin Page
          </h1>
          {authorised ? (
            <div className="p-2 bg-white dark:bg-black transition-all ease-in-out rounded shadow-sm w-full  ">
              <div className="flex justify-center py-5">
                <div className="upload-card">
                  <div className="upload-card-header">
                    <AiOutlineCloudUpload size={100} />
                    <p>{fileSelected ? fileName : "Browse File to upload!"}</p>
                  </div>
                  <label for="file-upload" className="upload-card-footer">
                    {fileSelected ? (
                      <AiOutlineCheckCircle size={55} />
                    ) : (
                      <AiOutlineFileAdd size={55} />
                    )}
                    <p className="text-white">
                      {fileSelected ? "Click to submit" : "Not selected file"}
                    </p>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="text-center w-full text-xl py-5">
                Suggestions Prompts
              </div>
              {suggestionList?.suggestions?.map((suggestion, index) => (
                <div>
                  <div
                    key={index}
                    className="flex  flex-row w-full justify-between mb-5"
                  >
                    <div className="flex flex-row space-x-4">
                      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
                        {suggestion.suggestion}
                      </div>
                      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
                        {suggestion.answer}
                      </div>
                    </div>
                    <div>
                      <button
                        className="bg-red-500 text-white rounded-full px-4 py-2"
                        onClick={() => handleSuggestionRemoval(index)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col w-full gap-y-4">
                <input
                  type="text"
                  placeholder="Question"
                  className="dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded p-2 mb-2 w-full"
                  value={suggestion}
                  onChange={(e) => handleSuggestionChange(e)}
                />
                <input
                  type="text"
                  placeholder="Answer"
                  className="dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded p-2 mb-2 w-full"
                  value={answer}
                  onChange={(e) => handleAnswerChange(e)}
                />
              </div>
              <div className="flex flex-row py-5 justify-center overflow-hidden">
                <button
                  className="rounded-md px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-600 text-indigo-600 "
                  onClick={() => handleAddSuggestionClick(suggestion, answer)}
                >
                  <span class="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                  <span class="relative text-indigo-600 transition duration-300 group-hover:text-white ease">
                    Add Suggestion
                  </span>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-red-500 text-xl text-center py-2">
                  {" "}
                  Danger zone
                </div>
                <div className="flex gap-4 border p-8 border-gray-200 md:w-1/2 rounded justify-center">
                  <button
                    className="px-5 py-2.5 font-medium bg-red-50 hover:bg-red-100 hover:text-red-600 text-red-500 rounded-lg text-sm"
                    onClick={async () => {
                      try {
                        await axios.get(
                          "http://34.148.188.181:4600/api/setup_model"
                        );
                        alert("Request to start the model has been sent!");
                      } catch (error) {
                        console.error("Error:", error);
                        alert("There was an error in starting the model.");
                      }
                    }}
                  >
                    Start the Model
                  </button>
                  <button
                    className="px-5 py-2.5 font-medium bg-red-50 hover:bg-red-100 hover:text-red-600 text-red-500 rounded-lg text-sm"
                    onClick={async () => {
                      try {
                        await axios.get(
                          "http://34.148.188.181:4600/api/shutdown"
                        );
                        alert("Request to shutdown the model has been sent!");
                      } catch (error) {
                        console.error("Error:", error);
                        alert("There was an error in shutting down the model.");
                      }
                    }}
                  >
                    Shutdown the model
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card ">
              <div class="circle"></div>
              <div class="circle"></div>
              <div className="flex w-full justify-center items-center text-center card-inner ">
                <form className="login-form inputGroup" onSubmit={handleSubmit}>
                  <h1 className="text-2xl py-5">Login</h1>
                  <input
                    type="text"
                    className="input-field "
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
                  <button type="submit" className="submit-button">
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
