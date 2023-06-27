
let bookmarkArr: HTMLDivElement[] = [];
let bookmarkStrArr: string[] = [];

const btn: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;

function makeBookMark(name: string): HTMLDivElement {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    const deleteBtn = document.createElement('button')
    btn.textContent = name;
    btn.className = "bkm-btn"
    deleteBtn.textContent = "x";
    deleteBtn.className = 'dlt-btn';
    deleteBtn.name = name;
    div.className = "bkm-div"
    div.appendChild(btn);
    div.appendChild(deleteBtn);
    return div;
}
//when user adds a new bookmark
function handleClick(event: Event): void {
    event.preventDefault();
    const form: HTMLFormElement = event.target as HTMLFormElement;
    const errMsg: HTMLParagraphElement = document.getElementById('err-msg') as HTMLParagraphElement;
    errMsg.innerHTML = "";
    const tabName: HTMLInputElement = form.elements.namedItem("bookmark") as HTMLInputElement;
    const inputValue: string = tabName.value;

    //input validation
    if (inputValue.trim() === "") {
        errMsg.innerHTML = "You must assign a name"
        return;
    }
    if (inputValue.length > 16) {
        tabName.value = "";
        errMsg.innerHTML = "Maximum character length: 16"
        return;
    }
    if (bookmarkStrArr.includes(inputValue)) {
        tabName.value = "";
        errMsg.innerHTML = "Bookmark already exists, try a different name";
        return;
    }
    
    tabName.value = "";
    //maybe add functionality that checks if bookmark with same name alr exists
    
    bookmarkArr.push(makeBookMark(inputValue));
    bookmarkStrArr.push(inputValue);
    //display bookmarks onto screen
    bookmarkArr.forEach(bmark => {
        document.body.appendChild(bmark);
    })

    chrome.storage.local.set({bookmarks: bookmarkStrArr});

    chrome.runtime.sendMessage({message: "Create"}, (response: string[]) => {
       chrome.storage.local.set({[inputValue]: response});
    })
    // addBtnListener();
    // addDltListner(); <-- doesnt work, because existing bookmarks get multiple listners
    //setting btn listners for new bookmarks
    const newDltBtn: HTMLButtonElement = bookmarkArr[bookmarkArr.length - 1].childNodes[1] as HTMLButtonElement;
    newDltBtn.addEventListener('click', event => {
        const pressedBtn = event.target as HTMLButtonElement;
        const value: string = pressedBtn.name;
        handleBtnClick("Delete", value); 
    })

    const newBkmBtn: HTMLButtonElement = bookmarkArr[bookmarkArr.length - 1].childNodes[0] as HTMLButtonElement;
    newBkmBtn.addEventListener('click', event => {
        const pressedBtn = event.target as HTMLButtonElement;
        const value: string = pressedBtn.innerHTML;
        handleBtnClick("Execute", value); 
    })

}

btn.addEventListener('submit', handleClick);

//executes when user clicks on extension
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get("bookmarks", bmarks => {
        const bookMarks: string[] = bmarks.bookmarks;
        if (bookMarks) {
            bookMarks.forEach((bmark: string) => {
                bookmarkArr.push(makeBookMark(bmark));
                bookmarkStrArr.push(bmark);
            });
            bookmarkArr.forEach(bmark => {
                document.body.appendChild(bmark);
            });
            //we are running this inside the callback of DOMContentLoaded, to 
            //1. DOMContentLoaded: ensure that buttons are injected onto html before running logic
            //2. callback: make sure logic inside callback is done executing before running this.
            addBtnListener();
            addDltListner();
        }
    })
});

function handleBtnClick(func: string, bkmName: string): void {
    chrome.runtime.sendMessage({message: func, bkmName}, (response: string) => {
        const dltBtn: HTMLButtonElement = document.querySelector(`button[name="${response}"]`) as HTMLButtonElement;
        console.log(dltBtn, response)
        const divElement: HTMLDivElement = dltBtn.parentElement as HTMLDivElement;
        if (divElement) {
            divElement.remove();
        }
        if (bookmarkStrArr.includes(response)) {
            bookmarkStrArr = bookmarkStrArr.filter(item => item != response);
            bookmarkArr = bookmarkArr.filter(div => div.childNodes[0].textContent !== response);
        }

    });
}

function addDltListner(): void {
    const dltButtons = document.querySelectorAll('.dlt-btn');
    dltButtons.forEach(dltButton => {
        console.log("added delete listener")
        dltButton.addEventListener('click', event => {
            const pressedBtn = event.target as HTMLButtonElement;
            const value: string = pressedBtn.name;
            handleBtnClick("Delete", value);
        })
    })
}

function addBtnListener(): void {
    const newButtons = document.querySelectorAll('.bkm-btn');
    newButtons.forEach(button => {
            button.addEventListener('click', event => {
                const pressedBtn = event.target as HTMLButtonElement;
                const value: string = pressedBtn.innerHTML;
                handleBtnClick("Execute", value);
            })
    }) 
}







    