import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import LoadingOverlay from 'react-loading-overlay';
import LoginForm from './components/login-form/login';
import Authenticated from './components/authenticated/authenticated';
import Onboarding from './components/onboarding/onboarding';

import 'antd/dist/antd.css';
import '../styles/styles.css';

export interface ILoading {
    (loading: boolean): void;
}

export interface ICheckSession {
    (): void;
}

export interface IOnboardingCompleted {
    (): void;
}

const JobTracker = () => {
    const [session, setSession] = useState({ jwt: null, isAuthenticated: false });
    const [loading, setLoading] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const [onboardingSearchSite, setOnboardingSearchSite] = useState(false);

    const checkSession = () => {
        chrome.storage.local.get(['jwt', 'onboardingComplete', 'onboardingSearchSite'], result => {
            if (result.jwt) {
                setSession({ jwt: result.jwt, isAuthenticated: true });
            } else {
                setSession({ jwt: null, isAuthenticated: false });
            }

            if (result.onboardingComplete) {
                setOnboardingComplete(true);
            }

            if (result.onboardingSearchSite) {
                setOnboardingSearchSite(result.onboardingSearchSite);
            }
        });
    };

    const onboardingCompleted = () => {
        chrome.storage.local.set({ onboardingComplete: true });
        setOnboardingComplete(true);
    };

    useEffect(() => {
        checkSession();
    }, []);

    const stateComponent = session.isAuthenticated ? (
        <Authenticated session={session} checkSession={checkSession} setLoading={setLoading} />
    ) : onboardingComplete ? (
        <LoginForm checkSession={checkSession} setLoading={setLoading} />
    ) : onboardingSearchSite ? (
        <LoginForm checkSession={checkSession} setLoading={setLoading} scrapeSite={true} />
    ) : (
        <Onboarding onboardingCompleted={onboardingCompleted} />
    );

    return (
        <LoadingOverlay active={loading} spinner text="">
            <div className="popup">{stateComponent}</div>
        </LoadingOverlay>
    );
};

ReactDOM.render(<JobTracker />, document.getElementById('root'));
