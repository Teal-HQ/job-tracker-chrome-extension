import React from 'react';
import * as ReactDOM from 'react-dom';
import { Col, Row } from 'antd';

import '../styles/styles.css';

const Installation = () => {
    return (
        <Row justify="center">
            <Col className="dark-background-container" span={8}>
                <img className="teal-logo" src={chrome.runtime.getURL('images/teal_logo_seal_gold.png')} />
                <h1>Pin the Teal Chrome Extension and then click on the extension icon to start saving job posts.</h1>
            </Col>
            <Col className="animation-container" span={16}>
                <div className="image-wrapper">
                    <img className="animation-svg" src={chrome.runtime.getURL('images/after-install.svg')} />
                    <img className="arrow-up" src={chrome.runtime.getURL('images/after-install-arrow.svg')} />
                </div>
            </Col>
        </Row>
    );
};

ReactDOM.render(<Installation />, document.getElementById('root'));
