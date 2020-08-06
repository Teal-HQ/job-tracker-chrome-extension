import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Layout, Col, Row } from 'antd';
import LoadingOverlay from 'react-loading-overlay';

import LoginForm from "./components/login-form/login";
import Authenticated from "./components/authenticated/authenticated";
import { WEB_CLIENT_URL } from '../config/config';

import 'antd/dist/antd.css';
import "../styles/popup.css";

const { Header, Content } = Layout;

const JobTracker = () => {
  const [jwt, setJwt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSession = () => {
    chrome.storage.local.get(['jwt'], function(result) {
      if(result.jwt) {
        setJwt(result.jwt);
        setIsAuthenticated(true);
      } else {
        setJwt(null);
        setIsAuthenticated(false);
      }
    });
  };

  useEffect(() => {
    checkSession();
  }, []);

  let stateComponent;
  if (isAuthenticated) {
    stateComponent = <Authenticated jwt={jwt} setLoading={setLoading}/>
  } else {
    stateComponent = <LoginForm checkSession={checkSession} setLoading={setLoading} />
  }

  return (
    <LoadingOverlay active={loading} spinner text=''>
      <div className="popup">
        { stateComponent }
      </div>
    </LoadingOverlay>
  );
}

ReactDOM.render(<JobTracker />, document.getElementById("root"));
