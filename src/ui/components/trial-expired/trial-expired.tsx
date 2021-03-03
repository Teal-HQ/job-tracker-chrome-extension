import { Button } from 'antd';
import React from 'react';
import { MEMBERS_APP_URL } from '../../../config/config';

const TrialExpired = props => {
    return (
        <div className="trial-expired-content">
            <h3>The Job Tracker extension is only available with Teal Pro</h3>
            <p>
                Previous job listings are still saved, but you need to upgrade to Pro to continue using the extension to save jobs and
                access them. When you upgrade, you’ll also get:
            </p>
            <ul>
                <li>Access to all Digital Apps, Tools &amp; Templates</li>
                <li>A 1:1 Career Planning Session with a Teal Guide</li>
                <li>Option to join an Accountability Career Group</li>
                <li>Live events, practice sessions, classes, and more.</li>
            </ul>
            <div className="action-buttons">
                <a href={`${MEMBERS_APP_URL}checkout`} target="_blank" className="ant-btn ant-btn-primary">
                    Upgrade to Pro
                </a>
                <a href={`${MEMBERS_APP_URL}plans`} target="_blank" className="ant-btn learn-more">
                    Learn More
                </a>
            </div>
        </div>
    );
};

export default TrialExpired;
