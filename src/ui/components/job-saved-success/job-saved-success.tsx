import React from 'react';
import { Col, Row } from 'antd';
import { WEB_CLIENT_URL } from '../../../config/config';

interface ISuccessData {
    company: string;
    role: string;
    id: string;
}

interface IJobSavedSuccess {
    data: ISuccessData;
}

const JobSavedSuccess = (props: IJobSavedSuccess) => {
    const { data } = props;
    return (
        <div className="success-message">
            <Row>
                <Col span={6}>
                    <img src={chrome.runtime.getURL('images/teal_logo_43.svg')} />
                </Col>
                {data.id && (
                    <Col span={18}>
                        <div>
                            {data.company} {data.role}
                        </div>
                        <div>
                            Job saved.{' '}
                            <a target="_blank" href={`${WEB_CLIENT_URL}job-tracker/${data.id}`}>
                                View now &#8594;
                            </a>
                        </div>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default JobSavedSuccess;
