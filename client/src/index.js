import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AttemptPage from './pages/AttemptPage';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
      {/* Below is an example of how you may invoke the attempt page component */}
      {/*<AttemptPage*/}
      {/*    id={1}*/}
      {/*    question={`function foo() {\nconst message = "Hello, world!";\nconsole.log(message);\n}`}*/}
      {/*    attempt_num={3}*/}
      {/*    password="pass123"*/}
      {/*/>*/}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
