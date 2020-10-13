import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Input, Alert, Statistic } from 'antd';
import { login } from '../../services/login';
import { ILoading, ICheckSession } from '../../popup';
import { defaultJobPost, getRules } from '../../services/job-post';
import { WEB_CLIENT_URL } from '../../../config/config';

interface ILoginForm {
    checkSession: ICheckSession;
    setLoading: ILoading;
    scrapeSite?: boolean;
}

const LoginForm = (props: ILoginForm) => {
    const [loginError, setLoginError] = useState(null);
    const [jobPost, setJobPost] = useState(defaultJobPost);

    const loginRequest = ({ email, password }) => {
        props.setLoading(true);

        login(email, password)
            .then(response => {
                chrome.storage.local.set({ jwt: response.data.data.attributes.jwt, email: email }, function () {
                    props.checkSession();
                    props.setLoading(false);
                });
                chrome.storage.local.set({ onboardingComplete: true });
            })
            .catch(error => {
                if (error?.response?.status === 401) {
                    setLoginError('Unauthorized');
                    props.setLoading(false);
                }
                console.log(error);
            });
    };

    const requestDataFromActiveTab = () => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            const url = tabs[0] ? tabs[0].url : null;
            props.setLoading(true);
            getRules(url)
                .then(rules => {
                    props.setLoading(false);
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'getData', rules }, function (response) {
                            setJobPost({ ...response.data, url });
                        });
                    });
                })
                .catch(error => {
                    props.setLoading(false);
                });
        });
    };

    useEffect(() => {
        props?.scrapeSite && requestDataFromActiveTab();
    }, []);

    return (
        <div className="login-form">
            <div className="login-header">
                <img className="teal-logo" src={chrome.runtime.getURL('images/teal_logo_43.svg')} />
                <h3>Sign in to Teal</h3>
            </div>
            <Row justify="center">
                {loginError && (
                    <Alert
                        message={
                            <div>
                                <strong>Failed to sign in!</strong> Please check your credentials or check your email to activate your
                                account.
                            </div>
                        }
                        type="error"
                    />
                )}
                <Form name="basic" onFinish={loginRequest}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                        <a target="_blank" href={`${WEB_CLIENT_URL}account/reset/request`}>
                            Reset Password
                        </a>
                    </Form.Item>

                    <Form.Item>
                        Not a member?{' '}
                        <a target="_blank" href={`${WEB_CLIENT_URL}`}>
                            Sign Up
                        </a>
                    </Form.Item>
                </Form>
            </Row>
            {props.scrapeSite && (
                <Row className="job-post-data" style={{ marginTop: 20 }} gutter={16}>
                    <hr />
                    <h4>
                        Here is some data we collected <br /> from this Job Post
                    </h4>
                    <Col span={24}>
                        <label>Job Title</label>
                        <div>{jobPost?.role || 'N/A'}</div>
                    </Col>
                    <Col span={24}>
                        <label>Company</label>
                        <div>{jobPost?.company || 'N/A'}</div>
                    </Col>
                    <Col span={24}>
                        <label>Location</label>
                        <div>{jobPost?.location || 'N/A'}</div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default LoginForm;
