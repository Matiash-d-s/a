import React, { useState, useEffect, useRef } from 'react';
//import {createAssistant} from '@sberdevices/assistant-client';
import getState from '../App'



//const init = () => {
//  return createAssistant({getState});
//}
//
//let assistant = init();


const Question = ({ data, /*onAnswerUpdate, numberOfQuestions, activeQuestion, onSetActiveQuestion, onSetStep,*/
                  selected, setSelected, error, setError, nextClickHandler
                  }) => {
  //const [selected, setSelected] = useState('');
  //const [error, setError] = useState('');
  const radiosWrapper = useRef();

  //assistant.on("data", (event) => {
  //  console.log("Question assistant.on(\"data\")", event);
  //  if (event.action.type === 'quiza') {
  //    nextClickHandler();
  //  }
  //});

  useEffect(() => {
    console.log("Question useEffect");
    const findCheckedInput = radiosWrapper.current.querySelector('input:checked');
    if(findCheckedInput) {
      findCheckedInput.checked = false;
    }
  }, [data]);

  function changeHandler (e)  {
    console.log(e);
    setSelected(e.target.value);
    if(error) {
      setError('');
    }
  }

  //function nextClickHandler  ()  {
  //  console.log("Question nextClickHandler()")
  //  if(selected === '') {
  //    return setError('Пожалуйста выберите вариант ответа');
  //  }
  //  onAnswerUpdate(prevState => [...prevState, { q: data.question, a: selected }]);
  //  setSelected('');
  //  if(activeQuestion < numberOfQuestions - 1) {
  //    onSetActiveQuestion(activeQuestion + 1);
  //  }else {
  //    onSetStep(3);
  //  }
  //}

  return(
    <div className="card">
      <div className="card-content">
        <div className="content">
          <h2 className="mb-5">{data.question}</h2>
          <div className="control" ref={radiosWrapper}>
            {data.choices.map((choice, i) => (
              <label className="radio has-background-light" key={i}>
                <input type="radio" name="answer" value={choice} onChange={changeHandler} />
                {choice}
              </label>
            ))}
          </div>
          {error && <div className="has-text-danger">{error}</div>}
          <button className="button is-link is-medium is-fullwidth mt-4" onClick={nextClickHandler}>Следующий вопрос</button>
        </div>
      </div>
    </div>
  );
}

export default Question;
