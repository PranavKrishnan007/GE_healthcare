"use client";

import {useEffect, useState} from 'react'
import {db, storage} from '@/app/firebase'
import {arrayUnion, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore'
import {ref, uploadBytes} from "firebase/storage";
import TopBar from '@/components/topbar/topbar'
import axios from "axios";
import {AiOutlineCheckCircle, AiOutlineCloudUpload, AiOutlineFileAdd,} from "react-icons/ai";


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
export const getIPAddress = async () => {
  try {
    const docRef = doc(db, "ip", "address");
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.data(), "from firebase");
    return docSnap.data() ; // Provide a default if data is undefined
  } catch (error) {
    console.log("Error getting suggestions: ", error);
    // Handle the error and provide a default value
  }
}


const Admin = () => {
  const [authorised, setAuthorised] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [suggestionList, setSuggestionList] = useState({ suggestions: [] });
  const [fileSelected, setFileSelected] = useState(false);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);

  const [suggestion, setSuggestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [IPAddress, setIPAddress] = useState('');

  useEffect(() => {
    getSuggestions().then((suggestions) => setSuggestionList(suggestions));
  }, [])

  useEffect(() => {
    getIPAddress().then((address ) => setIPAddress(address));
  }, [])

  const handleSuggestionRemoval = async (index) => {
    const newSuggestions = [...suggestionList.suggestions];
    newSuggestions.splice(index, 1);
    const docRef = doc(db, "data", "suggestions");
    try {
      await updateDoc(docRef, {
        "suggestions": newSuggestions
      });
      setSuggestionList({ suggestions: newSuggestions });
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


  const handleIP = async (IPAddress) => {
    const docRef = doc(db, "ip", "address");
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        try {
          await updateDoc(docRef, {
            "address": { ip_address: IPAddress }
          });
        } catch {
          console.log("error");
        }
      } else {
        try {
          await setDoc(docRef, { address: { ip_address: IPAddress}});
        } catch (error) {
          console.log("error");
        }
      }
    } catch (error) {
      console.log(error);
    }
    console.log(IPAddress);
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

  const handleIPChange = (e) => {
    setIPAddress(e.target.value);
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileSelected(true);
    setFileName(event.target.files[0].name);
  };

  const handleUploadSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      // Create a storage reference and upload the file
      const storageRef = ref(storage, `pdfs/${file.name}`);
      await uploadBytes(storageRef, file);

      // Store a reference to the uploaded file in Firestore
      const docData = {
        pdfUrl: `pdfs/${file.name}`,
      };
      await setDoc(doc(db, "pdfs", file.name), docData);

      // Reset the form
      setFileSelected(false);
      setFileName('');
      setFile(null);
    }
  };
  return (
    <div className="min-h-screen  dark:text-white dark:bg-[#121314]">
      <div className="px-12">
        <TopBar admin={true} />
      </div>
      <div className="bg-transparent ">
        <div className="container mx-auto flex flex-col p-8 justify-center items-center ">
          <h1 className={`text-4xl ${ !authorised ? "" : "border-b border-gray-300" } font-sans   w-full font-bold text-black dark:text-white text-center pb-16`}>
            Admin Page
          </h1>
          {authorised ? (
             <div className="w-full">
            <div className="px-2 justify-center bg-transparent transition-all ease-in-out rounded border-b border-gray-300 shadow-sm w-full flex gap-6 ">
              <div className="text-center justify-center py-5 border-r px-6 border-gray-300">
                <form onSubmit={handleUploadSubmit}>
                  <div className="upload-card">
                    <div className="upload-card-header">
                      <AiOutlineCloudUpload size={100} />
                      <p>{fileSelected ? fileName : "Browse File to upload!"}</p>
                    </div>
                    <label htmlFor="file-upload" className="upload-card-footer">
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
                    <button type="submit" disabled={!fileSelected}>
                      Upload
                    </button>
                  </div>
                </form>
                <div className="mt-8 font-mono">
                  Upload your pdf here
                </div>

                <div className="input-css mt-12">
                  <input
                      type="text"
                      placeholder="Ip Address"
                      className="input input-alt dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded ps-2  w-full"
                      value={IPAddress.address?.ip_address}
                      onChange={(e) => handleIPChange(e)}
                  />
                  <span className="input-border input-border-alt"></span>
                </div>
                <div className="mt-8 max-w-[400px] mb-4 font-mono">
                  endpoint:
                  <p>
                    { IPAddress && `http://${IPAddress.address.ip_address}/`}
                  </p>
                </div>
                <button
                    className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]  active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={() => handleIP(IPAddress)}
                >
                  <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                  <span className="relative transition duration-300 group-hover:text-white ease">
                    Add
                  </span>
                </button>

              </div>
              <div className="w-full font-mono">
                <div className="text-center w-full text-xl py-5">
                  Suggestions Prompts
                </div>
                <div className="flex flex-col w-full gap-y-4">
                  <div className="input-css">
                    <input
                        type="text"
                        placeholder="Question"
                        className="input input-alt dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded p-2 "
                        value={suggestion}
                        onChange={(e) => handleSuggestionChange(e)}
                    />
                    <span className="input-border input-border-alt"></span>
                  </div>

                  <div className="input-css">
                    <input
                        type="text"
                        placeholder="Answer"
                        className="input input-alt dark:bg-gray-800 dark:text-white border-2 border-gray-300 rounded ps-2 "
                        value={answer}
                        onChange={(e) => handleAnswerChange(e)}
                    />
                    <span className="input-border input-border-alt"></span>
                  </div>

                </div >
                <div className="flex flex-row py-5 border-b border-gray-300 justify-center overflow-hidden">
                  <button
                      className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]  active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                      onClick={() => handleAddSuggestionClick(suggestion, answer)}
                  >
                    <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-indigo-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                    <span className="relative transition duration-300 group-hover:text-white ease">
                    Add Suggestion
                  </span>
                  </button>
                </div>


                <div className="overflow-y-scroll px-2 mt-6 max-h-[800px]">
                  {suggestionList?.suggestions?.map((suggestion, index) => (
                      <div>
                        <div
                            key={index}
                            className="flex  flex-row w-full justify-between mb-10"
                        >
                          <div className="flex flex-col">
                            <div className="p-2 my-2 w-[98%] bg-gray-200 dark:bg-gray-700  rounded">
                              {suggestion.suggestion}
                            </div>
                            <div className="p-2 bg-gray-200 w-[98%] dark:bg-gray-700 rounded">
                              {suggestion.answer}
                            </div>
                          </div>
                          <div>
                            <button
                                className="ml-2 cursor-pointer transition-all bg-red-500 text-white px-6 py-2 rounded-lg border-red-600   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]   active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                                onClick={() => handleSuggestionRemoval(index)}
                            >
                              remove
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>


              </div>
            </div>


              <div className="flex flex-col my-20 items-center justify-center">
                <div className="text-red-500 text-xl text-center py-2">
                  {" "}
                  Danger zone
                </div>
                <div className="flex gap-4 border p-8 border-gray-200 md:w-1/2 rounded justify-center">
                  <button
                      className="cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg border-green-600   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]   active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={async () => {
                      try {
                        await axios.get(
                          `http://${IPAddress.address.ip_address}/api/setup_model`
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
                      className="cursor-pointer transition-all bg-green-500 text-white px-6 py-2 rounded-lg border-green-600  border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]   active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={async () => {
                      try {
                         const response = await axios.get(
                          `http://${IPAddress.address.ip_address}/api/heath_check`  //we dont fking care about the http
                        );
                        alert("Request to check health the model has been sent!");
                        console("Health check response: " + response.data);
                      } catch (error) {
                        console.error("Error:", error);
                        alert("There was an error in health the model.");
                      }
                    }}
                  >
                    check health
                  </button>
                  <button
                      className="cursor-pointer transition-all bg-red-500 text-white px-6 py-2 rounded-lg border-red-600   border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]   active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    onClick={async () => {
                      try {
                        await axios.get(
                            `http://${IPAddress.address.ip_address}/api/shutdown`
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
            <div className="card">
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
