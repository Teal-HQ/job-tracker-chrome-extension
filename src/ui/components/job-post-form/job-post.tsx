import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Input, Alert } from 'antd';
import TextTruncate from 'react-text-truncate';
import { defaultJobPost, getRules, saveJobPost } from '../../services/job-post';
import { PAGES } from '../../../config/config';
import { INavigateTo, ILoading } from '../../popup';

export interface IJobPostForm {
  jwt: string,
  navigateTo: INavigateTo,
  setLoading: ILoading
}

const JobPostForm = (props: IJobPostForm) => {
  const { jwt, navigateTo, setLoading } = props;
  const [jobPost, setJobPost] = useState(defaultJobPost);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    requestDataFromActiveTab();
  }, []);

  useEffect(() => {
    form.setFieldsValue({company: jobPost?.company, role: jobPost?.role, location: jobPost?.location, note: jobPost?.note})
  }, [jobPost]);
  
  const requestDataFromActiveTab = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      const url = tabs[0] ? tabs[0].url : null;

      chrome.storage.local.get(['currentJobPost'], function(result) {
        if(result.currentJobPost && (url === null || result.currentJobPost.url === url)) {
         setJobPost(result.currentJobPost);
        } else {
          setLoading(true);
          getRules(url, jwt)
          .then((rules)=>{
            setLoading(false);
            if (!rules) {
              return;
            }
    
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {action: "getData", rules}, function(response) {
                syncJobPost({...response.data, url});
              });
            });
          })
          .catch(error => {
            setLoading(false);
          });
        }
      });
    });
  }

  const syncJobPost = (data) => {
    setJobPost(data);
    chrome.storage.local.set({"currentJobPost": data});
  }

  const onFormValuesChange = (values) => {
    if (values.note) {
      syncJobPost({...jobPost, note: values.note});
    }
  
    if (values.role) {
      syncJobPost({...jobPost, role: values.role});
    }
  
    if (values.company) {
      syncJobPost({...jobPost, company: values.company});
    }
  
    if (values.location) {
      syncJobPost({...jobPost, location: values.location});
    }
  }
  
  const save = (values) => {
    setError(false);
    setLoading(true);
    saveJobPost(jobPost, jwt)
    .then(response => {
      setLoading(false);
      chrome.storage.local.remove('currentJobPost');
      navigateTo(PAGES.SUCCESS, {...jobPost, id: response.data.data.id});
    })
    .catch(error => {
      setError(true);
      setLoading(false);
    });
  };

  return (
    <div className="job-post-form-container">
      {error ? (
        <Alert message={<div><strong>Something went wrong :(</strong> <br/> We couldn't save this job post, please try again later.</div>} type="error"/>
      ) : null}
      <Form
        form={form}
        name="jobPost"
        onFinish={save}
        onValuesChange={onFormValuesChange}
      >
        <Form.Item
          label="Job Title"
          name="role"
          rules={[{ required: true, message: 'Please enter the role.' }]}
        >
          <Input />
        </Form.Item>

        <Row gutter={[12,0]}>
          <Col span={12}>
            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: 'Please enter the company name.' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Job Location"
              name="location"
              rules={[{ required: true, message: 'Please enter the location.' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Add Notes"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Job Description Review"
        >
          <TextTruncate
            line={3}
            element="div"
            truncateText="…"
            text={jobPost?.description}
            containerClassName="job-description-preview"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default JobPostForm;