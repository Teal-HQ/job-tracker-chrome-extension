import React, { useState, useEffect }  from 'react';
import { Layout, Col, Row } from 'antd';
const { Header, Content } = Layout;

export interface IHeader {
  page: string,
  pages: any
}

const Header = (props: IHeader) => {
  const [page, setPage] = useState(props.pages.JOB_POST_FORM);
  const [pageData, setPageData] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  const navigateTo = (page: PAGES, data?:any) => {
    setPage(page);
    setPageData(data);
  }

  const logout = () => {
    chrome.storage.local.clear();
    setIsAuthenticated(false);
    setJwt(null);
  }

  let columns;

  if (props.page === props.pages.JOB_POST_FORM) {
    columns = <Col className="nav-wrapper" span={8}>
        <span onClick={(e) => navigateTo(props.pages.ABOUT)} className="clickable">About &amp; FAQ</span>
        <span onClick={(e) => navigateTo(props.pages.LINKEDIN_FORM)} className="clickable">LinkedIn Fetcher</span>
      </Col>;
  } else {
    columns = <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(props.pages.JOB_POST_FORM)} className="clickable">&#8592; Go Back</span></Col>;
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