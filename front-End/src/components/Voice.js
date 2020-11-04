import "./../Assets/Style/Voice.css";

import axios from "axios";
import React, { Component, Suspense, useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { langCodes } from "./ListOfLangCode";
import withVoice from "./withVoice";

// import { langCodes } from "./ListOfLangCode";

//  FUNCTIONAL //
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;

//mic.lang = "hi";
//mic.lang = "en-US";

function Voice() {
  const { speak } = useSpeechSynthesis();
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);
  const [selectedInLang, setInSelectedLang] = useState("Select-Language");
  const [selectedOutLang, setOutSelectedLang] = useState("Select-Language");
  useEffect(() => {
    handleListen();
  }, [isListening]);

  //   useEffect(() => {
  //     const landArr = [];
  //     for (let i in langCodes) {
  //       const obj = {
  //         i: langCodes[i],
  //       };
  //       landArr.push(`${i}: ${langCodes[i]}`);
  //       //console.log(`${property}: ${object[property]}`);
  //     }
  //     console.log(landArr);
  //   }, [langCodes]);

  const handleListen = () => {
    // const trans = require('google-translate-api');
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript, "Transcript");
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  //   const changeLanguage = (lng) => {
  //     console.log("Change");
  //     i18n.changeLanguage(lng);
  //   };

  const handleSaveNote = () => {
    const object = {
      line: note,
    };
    axios
      .post("http://localhost:5555/tran", object)
      .then((response) => {
        console.log(response, "Response");
        return response.data;
      })
      .then((json) => {
        if (json) {
          setSavedNotes([...savedNotes, json]);
          setNote("");
        } else {
          console.log("ELSE");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSpeech = () => {
    const readText = savedNotes.join(" ");
    console.log("TExt", readText);
    speak.lang = "gu";
    speak({
      text: readText,
    });
  };

  const handleInLangSelection = (key) => {
    setInSelectedLang(langCodes[key]);
    mic.lang = key  
   // console.log(key);
  };
  const handleOutLangSelection = (key) => {
    setOutSelectedLang(langCodes[key]);
    
    //console.log(key);
  };

  return (
    <>
      <h2
        style={{
          textAlign: "center",
        }}
      >
        Indian Voice to Different Language converter
      </h2>
      <div className="container-fluid">
        <div className="box mb-2">
          <div>
            <h2>Current Note</h2>
          </div>
          {isListening ? <span>🎙️</span> : <span>🛑</span>}
          <button 
          className="btn btn-secondary"
          onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          {/* <button onClick={() => changeLanguage('fr')}>fr</button> */}

          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {selectedInLang}
          </button>
          <div className="dropdown-menu">
            {Object.keys(langCodes).map((key) => {
              return (
                <div
                  className="dropdown-item"
                  key={key}
                  onClick={() => handleInLangSelection(key)}
                >
                  {langCodes[key]}
                </div>
              );
            })}
          </div>

          {/* <button onClick={() => changeLanguage("en")}>en</button> */}
          <button
            className="btn btn-primary"
            onClick={() => setIsListening((prevState) => !prevState)}
          >
            {isListening ? "Click to Stop" : "Click to Start"}
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h3>Saved Notes</h3>

          <button className="btn btn-success" onClick={() => handleSpeech()}>
            {" "}
            speak<span>🎙️</span>
          </button>
          <button
            type="button"
            className="btn btn-primary dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
             {selectedOutLang}
          </button>
          <div className="dropdown-menu">
            {Object.keys(langCodes).map((key) => {
              return (
                <div
                  className="dropdown-item"
                  key={key}
                  onClick={() => handleOutLangSelection(key)}
                >
                  {langCodes[key]}
                </div>
              );
            })}
          </div>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default withVoice(Voice);
