function HandleError(eventOrMessage, source, lineno, colno, error){
    const newcss = document.createElement('style')
    newcss.textContent = atob("LkVycm9yewogICAgY29sb3I6ICNmZmZmZmZkZTsKICAgIGRpc3BsYXk6IGJsb2NrOwogICAgZmxleC13cmFwOiB3cmFwOwogICAgd2lkdGg6IDUwMHB4OwoKICAgIG1hcmdpbjogYXV0bzsKfQoKLkVycm9yIGF7CiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7CiAgICBjb2xvcjogY29ybmZsb3dlcmJsdWU7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIHRleHQtYWxpZ246IGNlbnRlcjsKfQoKLkVycm9yIGE6aG92ZXJ7CiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTsKfQoKLkVycm9yIGltZ3sKICAgIGRpc3BsYXk6IGZsZXg7CiAgICBqdXN0aWZ5LXNlbGY6IGNlbnRlcjsKfQ==")
    document.head.append(newcss)

    if (document.querySelector(".linkcontainer")){
        document.querySelector(".linkcontainer").remove()
    }
    UnloadAllPages()
    const ErrMsgDiv = document.createElement("div")
    ErrMsgDiv.classList.add("Error")

    const Msg = document.createElement('h2')
    Msg.textContent = "Something went wrong.. :|"
    ErrMsgDiv.append(Msg)

    const ErrReason = document.createElement('h3')
    ErrMsgDiv.append(ErrReason)

    if (eventOrMessage instanceof PromiseRejectionEvent) {
        ErrReason.textContent = "Unhandled Promise (More info found in console)"
    } else {
        ErrReason.textContent = `Javascript error: ${error}`
    }

    const HomeLink = document.createElement('a')
    HomeLink.href = "/"
    HomeLink.textContent = "Back to home"
    ErrMsgDiv.append(HomeLink)

    const Image = document.createElement('img')
    Image.src = "./Media/Cat_confuzzled.svg"
    ErrMsgDiv.append(Image)

    document.body.appendChild(ErrMsgDiv)
}

if (location.hostname != '127.0.0.1'){
window.onerror = HandleError
window.onunhandledrejection = HandleError
}

window.onerror = HandleError
window.onunhandledrejection = HandleError