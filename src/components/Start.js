import React from 'react';

const Start = ({ onQuizStart }) => {
  return(
    <div className="card">
      <div className="card-content">
        <div className="content">
          <h1>Начать Тест</h1>
          <p>Удачи!</p>
          <button className="button is-info is-medium" onClick={onQuizStart}>Старт!</button>
        </div>
      </div>
    </div>
  );
}

export default Start;