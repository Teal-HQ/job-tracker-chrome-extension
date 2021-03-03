import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Input, Alert, Tooltip } from 'antd';
import TextTruncate from 'react-truncate';
import { defaultJobPost, getRules, saveJobPost } from '../../services/job-post';
import { ISession } from '../authenticated/authenticated';
import { PAGES } from '../../../config/config';
import { INavigateTo } from '../../../common/types';
import { ICheckSession, ILoading } from '../../popup';
import { logout } from '../../services/login';

export interface IJobPostForm {
    session: ISession;
    navigateTo: INavigateTo;
    setLoading: ILoading;
    checkSession: ICheckSession;
}

const JobPostForm = (props: IJobPostForm) => {
    const { session, navigateTo, setLoading, checkSession } = props;
    const [jobPost, setJobPost] = useState(defaultJobPost);
    const [siteWarning, setSiteWarning] = useState(false);
    const [siteMatchWarning, setSiteMatchWarning] = useState(false);
    const [error, setError] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        chrome.runtime.sendMessage({ action: 'navigateToJobPostForm' });
        requestDataFromActiveTab();

        const listener = (request, sender, sendResponse) => {
            const action = request?.action;
            if (action === 'urlChanged') {
                requestDataFromActiveTab();
            }

            return true;
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            company: jobPost?.company,
            role: jobPost?.role,
            location: jobPost?.location,
            note: jobPost?.note,
        });
    }, [jobPost]);

    const requestDataFromActiveTab = () => {
        const url = document.URL;
        chrome.storage.local.get(['currentJobPost'], result => {
            if (result.currentJobPost && (url === null || result.currentJobPost.url === url)) {
                setJobPost(result.currentJobPost);
            } else {
                props.setLoading(true);
                setSiteWarning(false);

                getRules(url)
                    .then(rules => {
                        props.setLoading(false);
                        if (!rules?.data) {
                            rules.siteMatch ? setSiteMatchWarning(true) : setSiteWarning(true);
                            return;
                        }
                        chrome.runtime.sendMessage({ action: 'getData', rules: rules.data }, response => {
                            setJobPost({ ...response.data, url });
                        });
                    })
                    .catch(error => {
                        props.setLoading(false);
                    });
            }
        });
    };

    const syncJobPost = data => {
        setJobPost(data);
        chrome.storage.local.set({ currentJobPost: data });
    };

    const onFormValuesChange = values => {
        if (values.note) {
            syncJobPost({ ...jobPost, note: values.note });
        }

        if (values.role) {
            syncJobPost({ ...jobPost, role: values.role });
        }

        if (values.company) {
            syncJobPost({ ...jobPost, company: values.company });
        }

        if (values.location) {
            syncJobPost({ ...jobPost, location: values.location });
        }
    };

    const save = values => {
        setError(false);
        setSiteWarning(false);
        setLoading(true);
        saveJobPost(jobPost, session.jwt)
            .then(response => {
                setLoading(false);
                chrome.storage.local.remove('currentJobPost');
                navigateTo(PAGES.SUCCESS, { ...jobPost, id: response.data.data.id });
            })
            .catch(error => {
                if (error.response.status === 401) {
                    logout();
                    checkSession();
                }
                setError(true);
                setLoading(false);
            });
    };

    return (
        <div className="job-post-form-container">
            {siteWarning && (
                <Alert
                    message={
                        <div>
                            <strong>Heads up!</strong>
                            <br />
                            This site/page isn't supported by our Chrome Extension, but you can still fill out the form yourself to save it
                            to your tracker.
                        </div>
                    }
                    type="warning"
                />
            )}
            {siteMatchWarning && (
                <Alert
                    message={
                        <div>
                            <strong>Heads up!</strong>
                            <br />
                            We see you are on one of our supported sites. Head over to a job description and this form will auto-populate.
                        </div>
                    }
                    type="warning"
                />
            )}
            {error && (
                <Alert
                    message={
                        <div>
                            <strong>Something went wrong :(</strong>
                            <br />
                            We couldn't save this job post, please try again later.
                        </div>
                    }
                    type="error"
                />
            )}
            <Form form={form} name="jobPost" onFinish={save} onValuesChange={onFormValuesChange}>
                <Form.Item label="Job Title" name="role" rules={[{ required: true, message: 'Please enter the role.' }]}>
                    <Input />
                </Form.Item>

                <Row gutter={[12, 0]}>
                    <Col span={12}>
                        <Form.Item label="Company" name="company" rules={[{ required: true, message: 'Please enter the company name.' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Job Location" name="location" rules={[{ required: true, message: 'Please enter the location.' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Add Notes" name="note">
                    <Input.TextArea />
                </Form.Item>

                {jobPost?.description && (
                    <Form.Item label="Job Description Preview">
                        <div className="job-description-preview">
                            <TextTruncate lines={3}>{jobPost?.description}</TextTruncate>
                        </div>
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Job
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default JobPostForm;
