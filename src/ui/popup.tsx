import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Layout, Col, Row } from 'antd';
import LoadingOverlay from 'react-loading-overlay';

import LoginForm from "./components/login-form/login";
import JobPostForm from "./components/job-post-form/job-post";
import About from "./components/about/about";
import { login } from "./services/login";
import { PAGES } from "../config/config";
import { WEB_CLIENT_URL } from '../config/config';

import 'antd/dist/antd.css';
import "../styles/popup.css";

const { Header, Content } = Layout;

export interface INavigateTo {
  (page: PAGES, data?: any): void;
}

export interface ILoading {
  (loading: boolean): void;
}

const JobTracker = () => {
  const [jwt, setJwt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [page, setPage] = useState(PAGES.JOB_POST_FORM);
  const [pageData, setPageData] = useState(null);
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

  const loginRequest = ( {email, password} ) => {
    setLoading(true);
    login(email, password)
    .then(response => {
      chrome.storage.local.set({"jwt": response.data.data.attributes.jwt}, function() {
        checkSession();
        setLoading(false);
      });
    })
    .catch(error => {
      if (error?.response?.status === 401) {
        setLoginError('Unauthorized');
        setLoading(false);
      }
      console.log(error);
    });
  };

  const logout = () => {
    chrome.storage.local.clear();
    setIsAuthenticated(false);
    setJwt(null);
  }

  const navigateTo = (page: PAGES, data?:any) => {
    setPage(page);
    setPageData(data);
  }

  return (
    <LoadingOverlay
      active={loading}
      spinner
      text=''
    >
      <div className="popup">
        {page === PAGES.SUCCESS ? (
          <div className="success-message">
          <Row>
            <Col span={6}>
              { /* TODO temp link to log out */ }
              <img src={chrome.runtime.getURL('images/teal_logo_43.svg')}/>
            </Col>
            {pageData &&
              <Col span={18}>
                <div>{pageData.company} {pageData.role}</div>
                <div>Job saved. <a target="_blank" href={`${WEB_CLIENT_URL}job-tracker/${pageData.id}`}>View now &#8594;</a></div>
              </Col>
            }
          </Row>
          </div>
        ) : (
          <>
          {isAuthenticated === true ? (
            <Layout>
              <Header>
                <Row>
                  <Col span={16}><img className="clickable" onClick={logout} src={chrome.runtime.getURL('images/teal_logo_32.svg')}/></Col>
                  {page === PAGES.JOB_POST_FORM ? (
                    <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(PAGES.ABOUT)} className="clickable">About &amp; FAQ</span></Col>
                  ) : (
                    <Col span={8}><span onClick={(e) => navigateTo(PAGES.JOB_POST_FORM)} className="clickable">&#8592; Go Back</span></Col>
                  )}      
                </Row>
              </Header>
              <Content>
                {page === PAGES.JOB_POST_FORM ? (
                  <JobPostForm jwt={jwt} navigateTo={navigateTo} setLoading={setLoading}/>
                ) : (
                  <About/>
                )}   
              </Content>
            </Layout>
          ) : (
            <LoginForm login={loginRequest} error={loginError}/>
          )}
          </>
        )} 
      </div>
    </LoadingOverlay>
  );
}

ReactDOM.render(<JobTracker />, document.getElementById("root"));
