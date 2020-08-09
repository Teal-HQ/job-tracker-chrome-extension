import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import LoadingOverlay from 'react-loading-overlay';
import LoginForm from './components/login-form/login';
import Authenticated from './components/authenticated/authenticated';

import 'antd/dist/antd.css';
import '../styles/popup.css';

export interface ILoading {
  (loading: boolean): void;
} 

export interface ICheckSession {
  (): void;
}

const JobTracker = () => {
  const [session, setSession] = useState({jwt: null, isAuthenticated: false});
  const [loading, setLoading] = useState(false);

  const checkSession = () => {
    chrome.storage.local.get(['jwt'], function(result) {
      if(result.jwt) {
        setSession({jwt: result.jwt, isAuthenticated: true});
      } else {
        setSession({jwt: null, isAuthenticated: false});
      }
    });
  };

  useEffect(() => {
    checkSession();
  }, []);

  let stateComponent = (session.isAuthenticated) ? 
    <Authenticated session={session} checkSession={checkSession} setLoading={setLoading}/> :
    <LoginForm checkSession={checkSession} setLoading={setLoading} />

  return (
    <LoadingOverlay active={loading} spinner text=''>
      <div className='popup'>
        { stateComponent }
      </div>
    </LoadingOverlay>
  );
}

ReactDOM.render(<JobTracker />, document.getElementById('root'));
