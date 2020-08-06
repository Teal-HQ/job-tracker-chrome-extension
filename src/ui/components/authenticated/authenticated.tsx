import { Layout, Col, Row } from 'antd';
const { Header, Content } = Layout;

import JobPostForm from "./components/job-post-form/job-post";
import About from "./components/about/about";
import Success from "./components/job-saved-success/job-saved-success";


export interface IAuthenticated {
  jwt: string,
  page: string,
  pages: any
}

const Authenticated = (props: IAuthenticated) => {
    
    const navigateTo = (page: PAGES, data?:any) => {
      setPage(page);
      setPageData(data);
    }

    let body;
    if (props.page === props.pages.JOB_POST_FORM) {
      body = <JobPostForm jwt={props.jwt}/>
    } else if (props.page === props.pages.ABOUT) {
      body = <About/>;
    } else if (props.page === props.pages.SUCCESS) {
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