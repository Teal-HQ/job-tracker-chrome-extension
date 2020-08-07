import React from 'react';
import { Layout, Col, Row } from 'antd';
const { Header } = Layout;

import { PAGES } from '../../../config/config';

interface IExtHeader {
  pageName: string,
  checkSession: any,
  navigateTo: any
}

const ExtHeader = (props: IExtHeader) => {
  const { pageName, checkSession, navigateTo } = props;

  const logout = () => {
    chrome.storage.local.clear();
    checkSession()
  }

  let columns;

  if (pageName === PAGES.JOB_POST_FORM) {
    columns = <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(PAGES.ABOUT)} className="clickable">About &amp; FAQ</span></Col>;
  } else {
    columns = <Col className="nav-wrapper" span={8}><span onClick={(e) => navigateTo(PAGES.JOB_POST_FORM)} className="clickable">&#8592; Go Back</span></Col>;
  }

  return (
    <Header>
      <Row>
        <Col span={16}><img className="clickable" onClick={logout} src={chrome.runtime.getURL('images/teal_logo_32.svg')}/></Col>
        {columns}
      </Row>
    </Header>);
};

export default ExtHeader;