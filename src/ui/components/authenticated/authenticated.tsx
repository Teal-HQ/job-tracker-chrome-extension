import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

import JobPostForm from '../../components/job-post-form/job-post';
import About from '../../components/about/about';
import Success from '../../components/job-saved-success/job-saved-success';
import ExtHeader from '../../components/ext-header/ext-header';
import { PAGES } from '../../../config/config';
import { ILoading, ICheckSession } from '../../popup';
import TrialExpired from '../trial-expired/trial-expired';

export interface ISession {
    jwt: string;
    isAuthenticated: boolean;
}

interface IAuthenticated {
    session: ISession;
    checkSession: ICheckSession;
    setLoading: ILoading;
    trialExpired: boolean;
}

const Authenticated = (props: IAuthenticated) => {
    const { session, checkSession, setLoading, trialExpired } = props;
    const [page, setPage] = useState({ name: PAGES.JOB_POST_FORM, data: null });

    useEffect(() => {
        const listener = (request, sender, sendResponse) => {
            const action = request?.action;
            if (action === 'reset') {
                navigateTo(PAGES.JOB_POST_FORM);
            }

            return true;
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, []);

    const navigateTo = (name: PAGES, data?: any) => {
        setPage({ name, data });
    };

    const routing = {
        [PAGES.JOB_POST_FORM]: (
            <JobPostForm session={session} navigateTo={navigateTo} setLoading={setLoading} checkSession={checkSession} />
        ),
        [PAGES.ABOUT]: <About checkSession={checkSession} />,
        [PAGES.SUCCESS]: <Success data={page.data} navigateTo={navigateTo} />,
    };

    const body = trialExpired && page.name !== PAGES.ABOUT ? <TrialExpired /> : routing[page.name];
    if (!body) console.log('the page is unknown.');

    return (
        <Layout>
            <ExtHeader pageName={page.name} checkSession={checkSession} navigateTo={navigateTo} />
            <Content>{body}</Content>
        </Layout>
    );
};

export default Authenticated;
