import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";

import LoginForm from "./components/login-form/login";
import JobPostForm from "./components/job-post-form/job-post";
import { login } from "./services/login";

import 'antd/dist/antd.css';
import "../styles/popup.css";

const JobTracker = () => {
  const [jwt, setJwt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loginError, setLoginError] = useState(null);

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

  const loginRequest = ( {email, password} ) => {
    // TODO catch errors
    login(email, password)
    .then(response => {
      chrome.storage.local.set({"jwt": response.data.data.attributes.jwt}, function() {
        checkSession();
      });
    })
    .catch(error => {
      console.log(error);
    });
  };

  return (
    <div className="popup-padded">
      {isAuthenticated === true ? (
        <JobPostForm jwt={jwt}/>
      ) : (
        <LoginForm login={loginRequest} error={loginError}/>
      )}
    </div>
  );
}

ReactDOM.render(<JobTracker />, document.getElementById("root"));
