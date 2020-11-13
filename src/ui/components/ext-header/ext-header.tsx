import React from 'react';
import { Layout, Col, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
const { Header } = Layout;

import { PAGES } from '../../../config/config';
import { INavigateTo } from '../../../common/types';
import { ICheckSession } from '../../popup';

interface IExtHeader {
    pageName: string;
    checkSession: ICheckSession;
    navigateTo: INavigateTo;
}

const ExtHeader = (props: IExtHeader) => {
    const { pageName, checkSession, navigateTo } = props;

    let columns =
        pageName === PAGES.JOB_POST_FORM ? (
            <Col className="nav-wrapper" span={20}>
                <span onClick={e => navigateTo(PAGES.ABOUT)} className="clickable">
                    About &amp; Account
                </span>
                <button className="icon-btn"><CloseOutlined/></button>
            </Col>
        ) : (
            <Col className="nav-wrapper" span={20}>
                <span onClick={e => navigateTo(PAGES.JOB_POST_FORM)} className="clickable">
                    &#8592; Go Back
                </span>
                <button className="icon-btn"><CloseOutlined/></button>
            </Col>
        );

    return (
        <Header>
            <Row>
                <Col span={4}>
                    <a href="https://app.tealhq.com/job-tracker" target="_blank">
                        <img src={chrome.runtime.getURL('images/teal_logo_32.svg')} />
                    </a>
                </Col>
                {columns}
            </Row>
        </Header>
    );
};

export default ExtHeader;
