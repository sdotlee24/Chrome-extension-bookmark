
let bookmarkArr: HTMLDivElement[] = [];
let bookmarkStrArr: string[] = [];

const btn: HTMLFormElement = document.getElementById("myForm") as HTMLFormElement;
let bkmBtns: HTMLButtonElement[] = Array.from(document.getElementsByClassName("bkm-btn")) as HTMLButtonElement[];

function makeBookMark(name: string): HTMLDivElement {
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.className = "bkm-btn"
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

    chrome.runtime.sendMessage({message: "Create"}, (response: string[]) => {
       chrome.storage.local.set({[inputValue]: response});
    })
    addBtnListener();

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
        }
    })
});

function handleBtnClick(bkmName: string): void {
   chrome.runtime.sendMessage({message: "Execute", bkmName});
}

function addBtnListener(): void {
    const newButtons = document.querySelectorAll('.bkm-btn');
    newButtons.forEach(button => {
            console.log("hello");
            button.addEventListener('click', event => {
                const pressedBtn = event.target as HTMLButtonElement;
                const value: string = pressedBtn.innerHTML;
                handleBtnClick(value);
            })
    }) 
}






    