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
        data.company = data.company.replace($('#SerpFixedHeader span.rating').text().trim(), '').trim();
        // /job-listing
        data.company = data.company
            .replace(
                $('.smarterBannerEmpInfo > div > div:nth-child(1) > div:nth-child(2) > div > div > div:nth-child(1) > span').text().trim(),
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
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
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
                  description: $(request.rules.description).text(),
                  description_html: $(request.rules.description).html(),
                  logo: $(request.rules.logo).attr('src'),
              };

        sendResponse({ data: sanitize(window.location.hostname, data) });
    }
});
