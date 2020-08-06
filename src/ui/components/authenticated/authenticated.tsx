import React, { useState, useEffect } from "react";
import { Layout } from 'antd';
const { Header, Content } = Layout;

import JobPostForm from "../../components/job-post-form/job-post";
import About from "../../components/about/about";
import Success from "../../components/job-saved-success/job-saved-success";
import ExtHeader from "../../components/ext-header/ext-header";
import { PAGES } from '../../../config/config';


export interface IAuthenticated {
  jwt: string,
  page: string
}

const Authenticated = (props: IAuthenticated) => {
  const [page, setPage] = useState(PAGES.JOB_POST_FORM);
  const [pageData, setPageData] = useState(null);

  const navigateTo = (page: PAGES, data?:any) => {
    setPage(page);
    setPageData(data);
  }

  let body;
  if (props.page === PAGES.JOB_POST_FORM) {
    body = <JobPostForm jwt={props.jwt} navigateTo={navigateTo}/>
  } else if (props.page === PAGES.ABOUT) {
    body = <About/>;
  } else if (props.page === PAGES.SUCCESS) {
    body = <Success/>;
  } else {
    console.log('the page is unknown.')
  }

  return <Layout>
            <ExtHeader page={props.page}/>
            <Content>{ body }</Content>
         </Layout>;
};

export default Authenticated;