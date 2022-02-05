import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Amplify } from 'aws-amplify';

const awsRegion = process.env.REACT_APP_AWS_REGION
const awsUserPoolId = process.env.REACT_APP_AWS_USER_POOL_ID
const awsUserPoolWebClientId = process.env.REACT_APP_AWS_USER_POOL_WEB_CLIENT_ID

Amplify.configure({
  Auth: {
      region: awsRegion,
      userPoolId: awsUserPoolId,
      userPoolWebClientId: awsUserPoolWebClientId
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
