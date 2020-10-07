import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Col, Row } from "antd";

import "antd/dist/antd.css";
import "../styles/installation.css";

const Installation = () => {
  return (
    <Row justify="center" align="middle">
      <Col span={8}>
        <h1>
          Pin the Teal <br /> Chrome Extension <br /> to get started
        </h1>
      </Col>
      <Col span={14}>
        <img src={chrome.runtime.getURL("images/after-install.svg")} />
      </Col>
      <Col className="arrow-up" span={2}>
        <img src={chrome.runtime.getURL("images/after-install-arrow.svg")} />
      </Col>
    </Row>
  );
};

ReactDOM.render(<Installation />, document.getElementById("root"));
