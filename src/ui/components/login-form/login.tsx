import React from 'react';
import { Row, Form, Button, Input, Alert } from 'antd';

export interface ILoginForm {
  login: any,
  error: string
}

const LoginForm = (props: ILoginForm) => {
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
        {props.error ? (
          <Alert message={<div><strong>Failed to sign in!</strong> Please check your credentials or check your email to activate your account.</div>} type="error"/>
        ) : null}
        <Form
          name="basic"
          onFinish={props.login}
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