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
let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYTJkZTI2ZDJjZGQ0MmRjN2Q0NmIxZjM3YzJjZmY5NzBhOTRmODQ0MmI0Mzk3MWQ5YjY5M2NhNTg4MjAwM2JiNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMzk2MjQ1OCwiaWF0IjoxNjIzODc2MDQ4LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiYTFiMjYxM2QtM2NkMC00Mjg1LTg3YjAtN2VmNjA5NWU2Mjg3Iiwic2lkIjoiNzEyZGQyODgtZTFmNi00YjNhLWFmNmMtMThkNjM2ZWU4YjFhIn0.kojXQQ3G20Lod1buvnsw4s4Np0kw07BHzBzUqxDygVlm_BqLocZtrbQcp7lq825GX5LuP1QDOY6uU0VAP_IRCrwacIHnvc1WAGWlLbKfrMck7_9PH7apHT9PEkXzOAoYsTRnP_46aUOvVejq4M-yEkfRenGEoUoHlDXOUhI0ilTFuoq5E3pth20DYELxSDr1dYs7a2vIKBhNHvffd7YTTNBerN9cCZ1qTcJ6ROKrA2L5GONHIrdlSqi1-agQdsXp23sX-VRjCBsxJEcjB0Qb_8ziqvFck1w6nQFTQEfyIUHmR8MykU1FJxLHTa4mla8PyCFQMlSU_P3d39IHLbnEBXqfym9FAp4j5IU086G00bdHQtHbvBPoqaHbJSvogQxbEqC9dR5t4oyLO7kMqe6lEN4eZSm3F5MwqkdBcs0FJxVjIBcMgavEt-JjoniEr9R5lZwdag_IfapBUuDIQE6yvmUuNq5OaPqBqKePiiahq2G2-rd3jI6z6KCKWVjzQJ-3KnCJTxdrWaeIGVs3cOeg3V1xpmjtkjOUl356iNUPCT9r1Dn7ctfjay568-yASor2A1FI-5jUICipxbV7ThHoRJjrVXtrHl8ZhPIq5ZY14rJ3aRAXrNCLoGrcmuSHTcBkU6LAcXNqiTvoK9UEKdfl4BMlrCZmxRO7qM_KJQjx2zU'
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
  console.log("App");

  assistant.on("data", (event) => {
    console.log("App assistant.on(\"data\")", event);
    if (event.action) {
      dispatchAction(event.action);
    }
  });

  function dispatchAction(action) {
    console.log("App dispatchAction", action);
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
      case 'quiza':
        nextClickHandler();
        break
      default:
        console.warn('Unknown event.action.type', action.type)
    }
  }

  const[step, setStep] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [time, setTime] = useState(0);

  // from Question
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  //

  useEffect(() => {
    console.log("App useEffect [step]");
    if(step === 3) {
      clearInterval(interval);
    }
  }, [step]);

  function quizStartHandler()  {
    console.log("App quizStartHandler");
    setStep(2);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  function showM(){
    console.log("App showM");
    setShowModal(true);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  function closeM(){
    console.log("App closeM");
    setShowModal(false);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  function resetClickHandler ()  {
    console.log("App resetClickHandler");
    setStep(1);
    setActiveQuestion(0);
    setAnswers([]);
    setTime(0);
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  function nextClickHandler  ()  {
    console.log("Question nextClickHandler()")
    if(selected === '') {
      return setError('Пожалуйста выберите вариант ответа');
    }
    //onAnswerUpdate(prevState => [...prevState, { q: data.question, a: selected }]);
    const data = quizData.data[activeQuestion];
    setAnswers(prevState => [...prevState, { q: data.question, a: selected }]);
    setSelected('');
    //if(activeQuestion < numberOfQuestions - 1) {
    if(activeQuestion < quizData.data.length - 1) {
      //onSetActiveQuestion(activeQuestion + 1);
      setActiveQuestion(activeQuestion + 1);
    }else {
      //onSetStep(3);
      setStep(3);
    }
  }

  return (
    <div className="App">
      {step === 1 && <Start onQuizStart={quizStartHandler} />}
      {step === 2 && <Question
        data={quizData.data[activeQuestion]}
        //onAnswerUpdate={setAnswers}
        //numberOfQuestions={quizData.data.length}
        activeQuestion={activeQuestion}
        //onSetActiveQuestion={setActiveQuestion}
        //onSetStep={setStep}
        //
        selected={selected}
        setSelected={setSelected}
        error={error}
        setError={setError}
        nextClickHandler={nextClickHandler}
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
