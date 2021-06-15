import React, { useState, useEffect } from 'react';
import './App.css';

import Start from './components/Start';
import Question from './components/Question';
import nextClickHandler from './components/Question';
import End from './components/End';
import Modal from './components/Modal';
import quizData from './data/quiz.json';
import {createSmartappDebugger, createAssistant,AssistantAppState} from '@sberdevices/assistant-client'
let initPhrase = 'Запусти тест на знание столиц';
let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYTJkZTI2ZDJjZGQ0MmRjN2Q0NmIxZjM3YzJjZmY5NzBhOTRmODQ0MmI0Mzk3MWQ5YjY5M2NhNTg4MjAwM2JiNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMzg2NzQ5MiwiaWF0IjoxNjIzNzgxMDgyLCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZTNjYTdjOTQtMTMzNy00Y2EwLWI5ZGQtOWRhYzhjNTM5YzUxIiwic2lkIjoiNWNkZDcwOTYtZmI1Ni00ZWE0LTk1NjAtMjg4NDVjZTc2ZmVmIn0.YEWhiGrFW5nyQui8vzjiyvfe2G7p8ClebjIYvKdfIIy05DioKb_tVYDIwr7OjBJjOqFXMpYZp8P-oQwqj82lYYzhop-TFRsGI9CCb2EfEDVMKwbXERMD9ppgD_j_kjEjuvkyzBM4xpM5dBFMRuSgE5DNLiqTNAfZm6iiEpJpcB9VM3PnP1JGTuPHZEf3akUcd7fGxdxIfj0G5yDnqgScjeG7B3P7rfqeSqAungMq2wdG2JAruYJqcLwCYsEuSyOzLxir9qBw_RNTKjSxIKbJ_BFQ6tO8u8MFAj56mWho5wAxhPnSa4s_eUNyt4ZCX9w-ZTkHkFefrxn_8zEHNqQC9fHDIYdjzUfi3JI_QuitaKA8IZP4nL9FR0wxEieNhugh8YbCJCo74nwJ3kt9FWQENLrHNpn5pTIIhpoPfMGZjhdulqTl_wWsBLenSOeWwDeh7TgTmqmhdbv2wlYyK3Pc2ahiFem3yIwOdRCO9aDk93EmfU5RfPTPZ48zoLjMDlp3DLUHAWaZItLFTl6UsK8mOMNXvk9DPR7oZzFo3cuHQDnScY3osC-9sVeQ_VLlNEBETtc-nIh1PurCcMTwvTZcioKk5p_77qBQCkmH6Nwuhr7nYkxAnCE6U1eHgcxesqv0aJWJ9YHo1Rj7iISz9DVRgblD5vDYND6dwAx2-WLMgD0'
    let isConfirmed = 0;
let interval;
const init = () => {
    return createSmartappDebugger({
        token,
     initPhrase,
     getState
      })
      return createAssistant({getState});
      
    }
    let assistant = init();
  function getState() {
    console.log("State was get");
    const state = {
      item_selector: {
        items: [
         quizData.data,
         quizData.data.length,
         quizData,
         Question
        ]
      }
    }
    return state;
  }

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
      case 'modali':
        if (step===3) {
          showM();
        }
      break
      case 'restart_game':
        if (step===3) {
          resetClickHandler();
        }
      break
      case 'close_modal':
        if (step===3) {
          closeM();
        }
      break
    }
  }

  const[step, setStep] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if(step === 3) {
      clearInterval(interval);
    }
  }, [step]);

function quizStartHandler()  {
    setStep(2);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

function showM(){
  
  setShowModal(true);
  interval = setInterval(() => {
    setTime(prevTime => prevTime + 1);
  }, 1000);
}
function closeM(){
  
  setShowModal(false);
  interval = setInterval(() => {
    setTime(prevTime => prevTime + 1);
  }, 1000);
}

  function resetClickHandler ()  {
    setStep(1);
    setActiveQuestion(0);
    setAnswers([]);
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
