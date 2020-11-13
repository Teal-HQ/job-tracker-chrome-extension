import React, { useEffect } from 'react';
import { Col, Row, Button } from 'antd';
import { PAGES, WEB_CLIENT_URL } from '../../../config/config';
import { INavigateTo } from '../../../common/types';

interface ISuccessData {
    company: string;
    role: string;
    id: string;
}

interface IJobSavedSuccess {
    data: ISuccessData;
    navigateTo: INavigateTo;
}

const JobSavedSuccess = (props: IJobSavedSuccess) => {
    const { data, navigateTo } = props;

    useEffect(() => {
        chrome.runtime.sendMessage({ action: 'jobSaved' });
    }, []);

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
