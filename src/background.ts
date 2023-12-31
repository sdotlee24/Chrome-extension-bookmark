

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (message.message === 'Create') {
        chrome.tabs.query({currentWindow: true}, (tabs) => {
            const tabUrls: string[] = tabs.map(element => {
                return element.url as string;
            })
            sendResponse(tabUrls);
        })
    } else if (message.message === 'Execute') {
        const bkmName = message.bkmName;
        chrome.storage.local.get(bkmName, (items) => {
            //we get an object with key:value -> bkmName:[array of urls]
            const urls: string[] = items[bkmName];
            openTabs(urls);
            
        })
    } else {
        //delete btn
        const bkmName = message.bkmName;
        chrome.storage.local.remove(bkmName).catch(err => console.log(err));
        chrome.storage.local.get("bookmarks").then(data => {
            const newArr: string[] = data["bookmarks"].filter((value: string) => value !== bkmName);
            chrome.storage.local.set({bookmarks: newArr})

        }).catch(err => console.log(err));
        sendResponse(bkmName);
        console.log(bkmName);
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
