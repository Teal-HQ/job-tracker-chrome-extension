// TODO figure out a way to get these rules from the server
const hostRules = {
    'jobs.lever.co': data => {
        data.company = data.company.replace(' Home Page', '').trim();
        data.location = data.location.replace(' /', '').trim();
        return data;
    },
    'boards.greenhouse.io': data => {
        data.company = data.company.replace('at ', '').trim();
        return data;
    },
    'www.indeed.com': data => {
        data.role = data.role.replace('- job post', '').trim();
        return data;
    },
    'www.glassdoor.com': data => {
        // /Job
        data.company = data.company
            .replace($('#SerpFixedHeader span.rating').text().trim(), '')
            .trim()
            .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, '');
        // /job-listing
        data.company = data.company
            .replace(
                $('.smarterBannerEmpInfo > div > div:nth-child(1) > div:nth-child(2) > div > div > div:nth-child(1) > span')
                    .text()
                    .trim()
                    .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
                ''
            )
            .trim();
        return data;
    },
};

const sanitize = (host, data) => {
    return hostRules[host] ? hostRules[host](data) : data;
};

const exceptions = {
    'indeed.com/jobs': request => {
        const iframeContents = $('#vjs-container-iframe').contents();
        const data = {
            company: iframeContents
                .find(request.rules.company)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: iframeContents
                .find(request.rules.role)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: iframeContents
                .find(request.rules.location)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: iframeContents.find('body').html(),
            description: iframeContents.find(request.rules.description).text(),
            description_html: iframeContents.find(request.rules.description).html(),
            logo: iframeContents.find(request.rules.logo).attr('src'),
        };
        return data;
    },
    'garysguide.com/jobs': request => {
        const data = {
            company: $(request.rules.company)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: $(request.rules.role)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: $(request.rules.location)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: $('body').html(),
            description: $(request.rules.description).text(),
            description_html: $(request.rules.description).html(),
            logo: $(request.rules.logo).attr('src'),
        };

        return data;
    },
    'simplyhired.com/search': request => {
        const data = {
            company: $(request.rules.company)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: $(request.rules.role)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: $(request.rules.location)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: $('body').html(),
            description: $(request.rules.description).text(),
            description_html: $(request.rules.description).html(),
            logo: $(request.rules.logo).attr('src'),
        };

        return data;
    },
    'simplyhired.com/job': request => {
        const data = {
            company: $(request.rules.company)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: $(request.rules.role)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: $(request.rules.location)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: $('body').html(),
            description: $(request.rules.description).text(),
            description_html: $(request.rules.description).html(),
            logo: $(request.rules.logo).attr('src'),
        };

        return data;
    },
    'idealist.org/[^]*/[^]*job': request => {
        const data = {
            company: $(request.rules.company)
                .get(0)
                .previousSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            role: $(request.rules.role)
                .text()
                .trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            location: $(request.rules.location)
                .get(0)
                .nextSibling.textContent.trim()
                .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
            body: $('body').html(),
            description: $(request.rules.description).text(),
            description_html: $(request.rules.description).html(),
            logo: $(request.rules.logo).attr('src'),
        };

        return data;
    },
};

const extractHtml = selector => {
    const selectorArray = selector.split(',');
    let html = '';
    selectorArray.forEach(sel => {
        html += $(sel)
            .html()
            .trim()
            .replace(/((<[\\s\\/]*script\b[^>]*>)([^>]*)(<\/script>))/g, '')
            .replace(/((svg\b[^>]*>)([^]*)(<\/svg>))/g, '')
            .replace(/((iframe\b[^>]*>)([^]*)(<\/iframe>))/gi, '');
    });

    return html;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'getData') {
        const data = exceptions[request.rules.root_url]
            ? exceptions[request.rules.root_url](request)
            : {
                  company: $(request.rules.company)
                      .text()
                      .trim()
                      .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
                  role: $(request.rules.role)
                      .text()
                      .trim()
                      .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
                  location: $(request.rules.location)
                      .text()
                      .trim()
                      .replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
                  body: $('body').html(),
                  description: $(request.rules.description)
                      .text()
                      .trim()
                      .replace(/((<[\\s\\/]*script\b[^>]*>)([^>]*)(<\/script>))/gi, '')
                      .replace(/((svg\b[^>]*>)([^]*)(<\/svg>))/gi, '')
                      .replace(/((iframe\b[^>]*>)([^]*)(<\/iframe>))/gi, ''),
                  description_html: extractHtml(request.rules.description),
                  logo: $(request.rules.logo).attr('src'),
              };

        // sometimes and specially on search pages, when users navigate between jobs and the url changes
        // the job posts take more time to load than our "urlChanged" interval
        // adding some code to detect empty responses and retry one more time per url
        if (data.company === '' && data.role === '' && data.location === '' && data.description === '') {
            if (typeof retry[document.URL] === 'undefined') {
                retry[document.URL] = true;
            }
        } else {
            if (retry[document.URL]) {
                retry[document.URL] = false;
            }
        }

        sendResponse({ data: sanitize(window.location.hostname, data) });
    }

    if (request.action === 'toggleApp') {
        toggle();
    }

    if (request.action === 'jobSaved') {
        adjustIframeHeight(350);
    }

    if (request.action === 'navigateToJobPostForm') {
        adjustIframeHeight(600);
    }
});

// app
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import JobTracker from '../ui/popup';
const App = () => {
    const iframeStyles = {
        height: 600,
        width: 354,
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 2147483647,
        border: 0,
        boxShadow: '-1px 1px 3px 1px lightgrey',
    };

    return (
        <Frame style={iframeStyles} head={[<link rel="stylesheet" href={chrome.runtime.getURL('css/styles.css')}></link>]}>
            <FrameContextConsumer>
                {({ document, window }) => {
                    return <JobTracker />;
                }}
            </FrameContextConsumer>
        </Frame>
    );
};

// create container for the app
const app = document.createElement('div');
app.id = 'teal-job-tracker-root';
app.style.display = 'none';
app.style.zIndex = '2147483647';
app.style.position = 'absolute';
app.style.opacity = '0';

const initApp = () => {
    document.body.appendChild(app);
    ReactDOM.render(<App />, app);
};
const toggle = () => {
    // first time
    if ($('#' + app.id).length === 0) {
        initApp();
        app.style.display = 'block';
        $('#' + app.id).animate({ opacity: 1 }, 500);
        return;
    }

    if (app.style.display === 'none') {
        app.style.display = 'block';
    } else {
        app.style.display = 'none';
        chrome.runtime.sendMessage({ action: 'reset' });
    }
};

const adjustIframeHeight = val => {
    $('#' + app.id + ' iframe').height(val);
};

let currentUrl = document.URL;
let retry = {};

const triggerUrlChanged = () => {
    if (app.style.display === 'none') return;
    const url = document.URL;
    if (currentUrl !== url || retry[url] === true) {
        currentUrl = url;
        chrome.runtime.sendMessage({ action: 'urlChanged' });
        if (retry[url] === true) {
            // only retry once
            retry[url] = false;
        }
    }
};

setInterval(() => {
    triggerUrlChanged();
}, 1500);
