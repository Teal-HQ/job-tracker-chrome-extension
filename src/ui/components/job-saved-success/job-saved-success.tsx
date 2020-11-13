import React, { useEffect } from 'react';
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
            {data.id && (
                <div className="message-container">
                    <strong>Success!</strong> {data.role} at {data.company} has been saved to your tracker.
                </div>
            )}
            <div className="button-row">
                <a
                    href="javascript:void(0)"
                    onClick={() => {
                        navigateTo(PAGES.JOB_POST_FORM);
                    }}
                    className="ant-btn ant-btn-primary"
                >
                    Keep job searching
                </a>
                <a target="_blank" href={`${WEB_CLIENT_URL}job-tracker/${data.id}`} className="ant-btn">
                    View now &#8594;
                </a>
            </div>
        </div>
    );
};

export default JobSavedSuccess;
