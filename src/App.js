import React, { useState, useEffect } from 'react';
import './App.css';

import Start from './components/Start';
import Question from './components/Question';
import End from './components/End';
import Modal from './components/Modal';
import quizData from './data/quiz.json';
import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client'
let initPhrase = 'Запусти тест на знание столиц';
let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYTJkZTI2ZDJjZGQ0MmRjN2Q0NmIxZjM3YzJjZmY5NzBhOTRmODQ0MmI0Mzk3MWQ5YjY5M2NhNTg4MjAwM2JiNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMzc3NzI0MywiaWF0IjoxNjIzNjkwODMzLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiODg1OGY0ZGItMDgwZS00NDllLWJhMTQtMmFjZjE3MmE1ODYzIiwic2lkIjoiOTY2MDlmYmEtMjZkYS00ODY2LWE3YTYtYjM4MWVhN2Y5MDEzIn0.VkHY17rNm_912GYgx26ZhEnbIXwcepYU3L_Td2px1plc_E5OkM_Xcj1ikdoiFBPBIh36kCPRBsDI75Oz6zF5RpNHjUKr1vSRW0oFBqScUNY2nAKr2ujs7L0Ek91Ky3p4R7nRrs3IR81ZTw84iTfzBhxPX2WKI3ougVKbdVXDXcIklIhhA_R28wl-gOSX3B5ya0Cpog3btoQtMS2u9AqC-Lz8PsASZXfd0M73kZrZVTViCUvuEW3L5ekeeLn8jyL0UTyYhmnzTb6xKaPfNlnmnwS8jRrQo1zX_qHlQqRqFLdPt_QGx-POn9Wly_NiE8EOVwGEIegHpon2kZZMzAFgwUwgiIAV9Zwv-bWkQ99QQxR4pXComNUQqbzQq-LLYLb9fW20LmQVomS5Da1lvCodhal-zC27-xwj1dvafFYSJ80uaMss9Z3bIIa2Tol-ZEzht7fZpGjmJXm2ZrGEeAEaW8Fa2MnxHz3dvTGnnbPqikc6btL1D4usqXQeqpr4eLtPJhlOoOMKaeaMi3qIg1XY7Amy571aWDLGig44Yc8s45jGUCwPcl4kSe11DHRxC0SN5h7sWurt9uaRbvd9yRzkJ75OKFfcDm1kxIYfGDDLTqSerPV1mCABsDwdcPmGNArM88sadRZOGNprkB9lWPCvoJEzkAyTJ-UucZA2EzUlWGo'
    let isConfirmed = 0;
let interval;

function getState() {
  console.log("State was get");
  const state = {
    item_selector: {
      items: [
       quizData.data,
       quizData.data.length,
       quizData

      ]
    }
  }
  return state;
}


const init = () => {
 return createSmartappDebugger({
     token,
 initPhrase,
 getState
  })
  return createAssistant({getState});
  
}
let assistant = init();
const App = () => {
   


assistant.on("data", (event) => {
  console.log(event);
  if (event.action) {
    dispatchAction(event.action);
  } 
});
  function dispatchAction(action) {
    switch (action.type) {
      case 'start_game':
        if (step === 1) {
          quizStartHandler();
        }
      break
      case 'modal':
        if (step===3) {
          setShowModal(true)
        }
      break
      case 'restart':
        if (step===3) {
          resetClickHandler()
        }
      break
    }
  }

  const [step, setStep] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if(step === 3) {
      clearInterval(interval);
    }
  }, [step]);

  const quizStartHandler = () => {
    setStep(2);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  const resetClickHandler = () => {
    setActiveQuestion(0);
    setAnswers([]);
    setStep(2);
    setTime(0);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  return (
    <div className="App">
      {step === 1 && <Start onQuizStart={quizStartHandler} />}
      {step === 2 && <Question 
        data={quizData.data[activeQuestion]}
        onAnswerUpdate={setAnswers}
        numberOfQuestions={quizData.data.length}
        activeQuestion={activeQuestion}
        onSetActiveQuestion={setActiveQuestion}
        onSetStep={setStep}
      />}
      {step === 3 && <End 
        results={answers}
        data={quizData.data}
        onReset={resetClickHandler}
        onAnswersCheck={() => setShowModal(true)}
        time={time}
      />}

      {showModal && <Modal 
        onClose={() => setShowModal(false)}
        results={answers}
        data={quizData.data}
      />}
    </div>
  );
}

export default App;
