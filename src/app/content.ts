chrome.runtime.sendMessage({}, (response) => {
  var checkReady = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(checkReady);
    }
  });
});

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
    sendResponse({ data });
  }
});
