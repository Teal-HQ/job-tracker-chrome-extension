import React, { useState, useEffect } from "react";
import { Row, Form, Button, Input, Alert } from 'antd';
import { login } from "../../services/login";

export interface ILoginForm {
  checkSession: any,
  setLoading: any
}

const LoginForm = (props: ILoginForm) => {
  const [loginError, setLoginError] = useState(null);

  const loginRequest = ( {email, password} ) => {
    props.setLoading(true);
    
    login(email, password)
    .then(response => {
      chrome.storage.local.set({"jwt": response.data.data.attributes.jwt}, function() {
        props.checkSession();
        props.setLoading(false);
      });
    })
    .catch(error => {
      if (error?.response?.status === 401) {
        setLoginError('Unauthorized');
        props.setLoading(false);
      }
      console.log(error);
    });
  };

  return (
    <div className="login-form">
      <div className="login-header">
        <img
          className="teal-logo"
          src={chrome.runtime.getURL('images/teal_logo_43.svg')}
        />
        <h3>Sign in to Teal</h3>
      </div>
      <Row justify="center">
        {loginError ? (
          <Alert message={<div><strong>Failed to sign in!</strong> Please check your credentials or check your email to activate your account.</div>} type="error"/>
        ) : null}
        <Form
          name="basic"
          onFinish={loginRequest}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </div>
  );
};

export default LoginForm;