import React, { useState, useEffect }  from 'react';
import { Layout, Col, Row } from 'antd';
const { Header, Content } = Layout;

import { PAGES } from '../../../config/config';

export interface IExtHeader {
  page: PAGES,
  navigateTo: any
}

const ExtHeader = (props: IExtHeader) => {
  const { page, navigateTo } = props;
  const [pageData, setPageData] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  const logout = () => {
    chrome.storage.local.clear();
    setIsAuthenticated(false);
    setJwt(null);
  }

  let columns;

  if (page === PAGES.JOB_POST_FORM) {
    columns = <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(PAGES.ABOUT)} className="clickable">About &amp; FAQ</span></Col>;
  } else {
    columns = <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(PAGES.JOB_POST_FORM)} className="clickable">&#8592; Go Back</span></Col>;
  }

  return 
    <Header>
      <Row>
        <Col span={16}><img className="clickable" onClick={logout} src={chrome.runtime.getURL('images/teal_logo_32.svg')}/></Col>
        {columns}
      </Row>
    </Header>;
};

export default Header;