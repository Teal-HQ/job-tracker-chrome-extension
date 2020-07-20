import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import TextTruncate from 'react-text-truncate';
import { defaultJobPost, getRules, saveJobPost } from '../../services/job-post';

export interface IJobPostForm {
  jwt: string
}

const JobPostForm = (props: IJobPostForm) => {
  const { jwt } = props;
  const [jobPost, setJobPost] = useState(defaultJobPost);
  const [form] = Form.useForm();

  useEffect(() => {
    requestDataFromActiveTab();
  }, []);

  useEffect(() => {
    form.setFieldsValue({company: jobPost?.company, role: jobPost?.role, location: jobPost?.location, note: jobPost?.note})
  }, [jobPost]);
  
  const requestDataFromActiveTab = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      
      getRules(url, jwt).then((rules)=>{
        if (!rules) {
          return;
        }

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getData", rules}, function(response) {
            setJobPost({...response.data, url});
          });
        });
      });
    });
  }

  const onFormValuesChange = (values) => {
    if (values.note) {
      setJobPost({...jobPost, note: values.note})
    }
  
    if (values.role) {
      setJobPost({...jobPost, role: values.role})
    }
  
    if (values.company) {
      setJobPost({...jobPost, company: values.company})
    }
  
    if (values.location) {
      setJobPost({...jobPost, location: values.location})
    }
  }
  
  const save = (values) => {
    saveJobPost(jobPost, jwt)
    .then(response => {
      
    })
    .catch(error => {

    });
  };

  return (
    <>
      <Row>
        <Col>
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

            <Form.Item
              label="Company"
              name="company"
              rules={[{ required: true, message: 'Please enter the company name.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Job Location"
              name="location"
              rules={[{ required: true, message: 'Please enter the location.' }]}
            >
              <Input />
            </Form.Item>

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
        </Col>  
      </Row>
    </>
  );
};

export default JobPostForm;