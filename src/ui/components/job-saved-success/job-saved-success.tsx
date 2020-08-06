import React from 'react';
import { Layout, Col, Row } from 'antd';

const JobSavedSuccess = () => {
  return (
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
  );
};

export default JobSavedSuccess;
