chrome.runtime.onInstalled?.addListener(details => {
    if (details.reason === 'install') {
        chrome.tabs.create({
            url: 'installation.html',
        });

        return false;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const action = request?.action;
    const rules = request?.rules;
    if (action === 'getData') {
        chrome?.tabs?.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getData', rules }, response => {
                sendResponse(response);
            });
        });
    }

    if (action === 'jobSaved') {
        chrome?.tabs?.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'jobSaved' });
        });
    }

    return true;
});

chrome.browserAction?.onClicked.addListener(tab => {
    chrome?.tabs?.query({ active: true, currentWindow: true }, tabs => {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: 'clickedBrowserAction' });
    });
});
