import React from 'react';

const extensionId = chrome.runtime.id;
/**
 * Generate injectable code for capturing a value from the contentScript scope and passing back via message
 * @param {string} valueToCapture - Name of the scoped variable to capture
 * @param {string} [optKey] - Key to use as message identifier. Defaults to valueToCapture
 */
const createMessageSenderInjectable = (valueToCapture, optKey) => {
    return `chrome.runtime.sendMessage('${extensionId}', {
        key: '${optKey || valueToCapture}',
        value: ${valueToCapture}
    });`;
};
const createMainInstanceCode = `
isDebug = window.location.href.includes('li2jr_debug=true');
window.LinkedinToResumeJson = isDebug ? LinkedinToResumeJson : window.LinkedinToResumeJson;
// Reuse existing instance if possible
liToJrInstance = typeof(liToJrInstance) !== 'undefined' ? liToJrInstance : new LinkedinToResumeJson(false, isDebug);
`;
const getLangStringsCode = `(async () => {
    const supported = await liToJrInstance.getSupportedLocales();
    const user = liToJrInstance.getViewersLocalLang();
    const payload = {
        supported,
        user
    }
    ${createMessageSenderInjectable('payload', 'locales')}
})();
`;

chrome.tabs.executeScript(
    {
        file: 'linkedin-resume.js'
    },
    () => {
        chrome.tabs.executeScript({
            code: `${createMainInstanceCode}${getLangStringsCode}`
        });
    }
);

const About = () => {
  return (
    <div className="about-faq-container">

      <h3 
        onClick={()=> {
          chrome.tabs.executeScript({
            code: `console.log(liToJrInstance.getJSON());`
          });
        }}
      >
        About
      </h3>
      <p>Teal’s Job Saver helps you easily save job listings and manage your your job search.</p>
      <h4>How it Works</h4>
      <p>When you come across a job posting you want to save for later, click Teal’s chrome extension, add your notes and click Save. We’ll scrape the job details and add them to your Teal account for you to revisit when you’re ready prepare your application.</p>
      <h4>New to Teal?</h4>
      <p>Teal provides guidance, community and tools for professionals job searching or looking to grow their careers. <a href="https://tealhq.com" target="_blank">Visit our website</a> to learn more.</p>
      <h3>FAQ</h3>
      <h4>What websites will this work on?</h4>
      <p>While you can save jobs from anywhere, we’ve built Teal’s Job Saver to work best on the most popular sites people job search on. This includes LinkedIn, Indeed, and other popular ATS systems.</p>
      <h4>The form autopopulates with the listing details most of the time, but not always. Why?</h4>
      <p>If you try to save a job listing and the form or job description is empty, we might not be as familiar to the site that you’re trying to save from. We’re continually improving our platform to work with all job listings, but until then you can add the information manually.</p>
      <h4>More questions or issues?</h4>
      <p>Email us at <a href="mailto:hello@tealhq.com" target="_blank">hello@tealhq.com</a></p>
    </div>
  );
};

export default About;