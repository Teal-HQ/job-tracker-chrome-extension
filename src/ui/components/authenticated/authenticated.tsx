import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
const { Header, Content } = Layout;

import JobPostForm from '../../components/job-post-form/job-post';
import About from '../../components/about/about';
import Success from '../../components/job-saved-success/job-saved-success';
import ExtHeader from '../../components/ext-header/ext-header';
import { PAGES } from '../../../config/config';
import { ILoading, ICheckSession } from '../../popup';

export interface ISession {
  jwt: string,
  isAuthenticated: boolean
}

interface IAuthenticated {
  session: ISession,
  checkSession: ICheckSession,
  setLoading: ILoading
}

const Authenticated = (props: IAuthenticated) => {
  const { session, checkSession, setLoading } = props;
  const [page, setPage] = useState({name: PAGES.JOB_POST_FORM, data: null});

  const navigateTo = (name: PAGES, data?:any) => {
    setPage({name, data});
  }

  const routing = {
    [PAGES.JOB_POST_FORM]: <JobPostForm session={session} navigateTo={navigateTo} setLoading={setLoading}/>,
    [PAGES.ABOUT]: <About/>,
    [PAGES.SUCCESS]: <Success data={page.data}/>
  };

  const body = routing[page.name];
  if (!body) console.log('the page is unknown.');

  return (<Layout>
            <ExtHeader pageName={page.name} checkSession={checkSession} navigateTo={navigateTo}/>
            <Content>{ body }</Content>
         </Layout>);
};

export default Authenticated;