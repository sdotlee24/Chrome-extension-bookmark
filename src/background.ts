
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

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (message.message === 'Create') {
        chrome.tabs.query({currentWindow: true}, (tabs) => {
            const tabUrls: string[] = tabs.map(element => {
                return element.url as string;
            })
            sendResponse(tabUrls);
        })
    } else {
        const bkmName = message.bkmName;
        chrome.storage.local.get(bkmName, (items) => {
            //we get an object with key:value -> bkmName:[array of urls]
            const urls: string[] = items[bkmName];
            openTabs(urls);
            
        })
    }
    //allows background script to handle the message async -> makes sure message port is open until response is sent
    return true;
})

async function openTabs(urls: string[]): Promise<void> {
    //logic: opens them in the same window where extension was clicked, if the window has only 1 tab, which is the home url
    //else, open the tabs in a seperate window
    const tabs = await chrome.tabs.query({currentWindow: true});
    if (tabs.length === 1 && tabs[0].url === "chrome://newtab/") {
        urls.forEach((url, index) => {
            if (index === 0) {
                chrome.tabs.update({url: url})
            } else {
                chrome.tabs.create({url: url});
            }
        })
    } else {
        chrome.windows.create({url: urls}); 
    }

}





// chrome.tabs.create({url: "https://www.twitter.com/home"});
