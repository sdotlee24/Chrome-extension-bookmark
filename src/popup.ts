
let bookmarkArr: HTMLDivElement[] = [];
let bookmarkStrArr: string[] = [];

const btn: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;

function makeBookMark(name: string): HTMLDivElement {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.textContent = name;
    div.appendChild(btn);
    return div;
}

function handleClick(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;
    const tabName: HTMLInputElement = form.elements.namedItem("bookmark") as HTMLInputElement;
    const inputValue: string = tabName.value;
    tabName.value = "";
    //maybe add functionality that checks if bookmark with same name alr exists
    
    bookmarkArr.push(makeBookMark(inputValue));
    bookmarkStrArr.push(inputValue);
    //display bookmarks onto screen
    bookmarkArr.forEach(bmark => {
        document.body.appendChild(bmark);
    })

    chrome.storage.local.set({bookmarks: bookmarkStrArr});

    chrome.runtime.sendMessage({message: "New Bookmark"}, (response: string[]) => {
       chrome.storage.local.set({[inputValue]: response});
    })

    //now, add logic to store the tabid's of bookmarks.
    // chrome.storage.local.set({[inputValue]: /*Number array */})

}

btn.addEventListener('submit', handleClick);

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get("bookmarks", bmarks => {
        const bookMarks: string[] = bmarks.bookmarks;
        if (bookMarks) {
            console.log(bookMarks);
            bookMarks.forEach((bmark: string) => {
                bookmarkArr.push(makeBookMark(bmark));
                bookmarkStrArr.push(bmark);
            });
            const bkmForm: HTMLFormElement = document.getElementById("bookmarks") as HTMLFormElement;
            bookmarkArr.forEach(bmark => {
                bkmForm.appendChild(bmark);
            });
        }
    })
});

//logic to handle bookmark button click





    