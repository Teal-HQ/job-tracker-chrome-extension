// TODO figure out a way to get these rules from the server
const hostRules = {
  'jobs.lever.co': (data) => {
    data.company = data.company.replace(' Home Page', '').trim();
    data.location = data.location.replace(' /', '').trim();
    return data;
  },
  'boards.greenhouse.io': (data) => {
    data.company = data.company.replace('at ', '').trim();
    return data;
  }
}

const sanitize = (host, data) => {
  return hostRules[host] ? hostRules[host](data) : data;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "getData") {
    const data = {
      company: $(request.rules.company).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g, ''),
      role: $(request.rules.role).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9]*$/g, ''),
      location: $(request.rules.location).text().trim().replace(/^[^a-zA-Z0-9]*|[^a-zA-Z0-9)]*$/g, ''),
      body: $("body").html(),
      description: $(request.rules.description).text(),
      description_html: $(request.rules.description).html(),
      logo: $(request.rules.logo).attr('src')
    };
    sendResponse({ data: sanitize(window.location.hostname, data) });
  }
});
