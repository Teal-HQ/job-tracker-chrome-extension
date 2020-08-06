import { Layout, Col, Row } from 'antd';
const { Header, Content } = Layout;

import JobPostForm from "../../components/job-post-form/job-post";
import About from "../../components/about/about";
import Success from "../../components/job-saved-success/job-saved-success";
import { PAGES } from '../../../config/config';


export interface IAuthenticated {
  jwt: string,
  page: string
}

const Authenticated = (props: IAuthenticated) => {
    let body;
    if (props.page === PAGES.JOB_POST_FORM) {
      body = <JobPostForm jwt={props.jwt}/>
    } else if (props.page === PAGES.ABOUT) {
      body = <About/>;
    } else if (props.page === PAGES.SUCCESS) {
      body = <Success/>;
    } else {
      console.log('the page is unknown.')
    }

    return <Layout>
      <Header>replace me with custom header component</Header>
      <Content>{ body }</Content>
    </Layout>;
};

export default Authenticated;