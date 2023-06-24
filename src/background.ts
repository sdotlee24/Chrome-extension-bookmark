
// chrome.tabs.onUpdated.addListener((tabid: number, changeInfo: chrome.tabs.TabChangeInfo, TAB: chrome.tabs.Tab) => {
//     if (changeInfo.status === 'complete') {
//         chrome.tabs.query({}, (tabs) => {
//             const tabIds: string[] = tabs.map(element => {
//                 return element.url as string;
//             })
//             console.log(tabIds);
//         })
//     }

// });

chrome.runtime.onMessage.addListener((messsage: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (messsage.message === 'New Bookmark') {
        chrome.tabs.query({}, (tabs) => {
            const tabUrls: string[] = tabs.map(element => {
                return element.url as string;
            })
            sendResponse(tabUrls);
        })
    }
    //allows background script to handle the message async -> makes sure message port is open until response is sent
    return true;
})





// chrome.tabs.create({url: "https://www.twitter.com/home"});
