const SkipFiles = ["Skip.txt"]

const RepoOwner = "Noahcatz"
const Repo = "Noah-Project-Dashboard"

const DevMode = (location.hostname == '127.0.0.1' && true)

const HomePage = document.querySelector(".StaticHomePage")
const ViewPage = document.querySelector(".ProjectView")
const WebListContainer = document.querySelector(".ItemList")
const WebList = document.querySelector(".ItemList ul")

function SetTemporaryCSS(CssName){
        const Css = document.createElement('link')
        Css.rel = "Stylesheet"
        Css.href = `./CSS/Pages/${CssName}.css`
        Css.id = "TemporaryCss"
        if (document.getElementById("TemporaryCss")){
            document.head.replaceChild(Css, document.getElementById("TemporaryCss"))
        }else{
            document.head.append(Css)
        }
        return Css;
}

function UnloadAllPages(){
    DeleteAllTemporaryElements()
    ShowAllHidden()

    HomePage.style.display = 'none'
    ViewPage.style.display = 'none'
    WebListContainer.style.display = 'none'
    WebList.innerHTML = ''
}

//Type=${listtype.split("s")[0]}&

function GenerateWebListItem(metadata, listtype){
    const Status = metadata.Status == undefined ? "active" : metadata.Status

    const ListItem = document.createElement('li')
    ListItem.dataset.name = metadata.name
    ListItem.classList.add("ListItem")
    ListItem.onclick = function() {location.href = (listtype == 'Games' ? `?Id=${metadata.name}#View` : `/Websites/${metadata.name}`)}

    const Thumbnail = document.createElement('img')
    Thumbnail.src = `https://raw.githubusercontent.com/${RepoOwner}/${Repo}/refs/heads/main/${listtype}/${metadata.name}/${metadata.Thumbnail}`
    ListItem.append(Thumbnail)

    const Title = document.createElement('h1')
    Title.textContent = metadata.Title
    ListItem.append(Title)

    if (Status != "active"){
        if ((Status == "down") || (Status == "maintenance")){
            const StatusElement = document.createElement('h4')
            if (Status == "down") {StatusElement.textContent = "Service is down"}
            if (Status == "maintenance") {StatusElement.textContent = "Service is under maintenance"}
            ListItem.append(StatusElement)
        }
        ListItem.classList.add(Status)
    }

    WebList.append(ListItem)
}

async function InitProjViewer(Id, Type) {
    const fetchlink = `https://raw.githubusercontent.com/${RepoOwner}/${Repo}/refs/heads/main/Games/${Id}`
    const Response = await fetch(`${fetchlink}/metadata.json`)
    const metadata = await Response.json()
    console.log(metadata)

    document.querySelector(".ProjectView h1").textContent = metadata.Title
    document.getElementById("ThumbImg").setAttribute("src", `${fetchlink}/${metadata.Thumbnail}`)
    if (metadata.DisabledOptions){
        if (metadata.DisabledOptions.includes("Play")){Hide(document.getElementById("Icon"))}
        metadata.DisabledOptions.forEach((buttonid) => document.getElementById(buttonid).setAttribute("disabled", ''))
    }
    if ((metadata.Description || metadata.Version) || (metadata.Status)){
        document.querySelector(".ProjNotes").style.display = 'block'
        if (metadata.Description){document.querySelector(".ProjNotes p").style.display = 'block'; document.querySelector(".ProjNotes p").textContent = metadata.Description; document.querySelector(".ProjNotes h2").style.display = 'block'}
        if (metadata.Version){document.querySelector(".ProjNotes h3").style.display = 'block'; document.querySelector(".ProjNotes h3").textContent = `Version: ${metadata.Version}`}
        if ((metadata.Status) && (metadata.Status == "down" || metadata.Status == "maintenance")){document.querySelector(".ProjNotes #ProjWarning").style.display = 'block'; document.querySelector(".ProjNotes #ProjWarning").textContent = (metadata.Status == "down" ? "⚠️Service is down⚠️" : "🛠️Service is under maintenance🛠️"); document.querySelector(".ProjNotes #ProjWarning").dataset.type = metadata.Status}
    }
    async function GetHtmlBlob(){
        if (location.hostname == 'noahsite.net'){
            return `/Games/${Id}/${metadata.Play}`
        }else{
            return `https://www.noahsite.net/Games/${Id}/${metadata.Play}`
        }
    }
    function ActivateIframe(){
            Hide(document.getElementById("Icon"))

            const fullscreenbutton = SetElementTemporary(document.createElement('button'))
            fullscreenbutton.id = 'Fullscreen'
            fullscreenbutton.textContent = 'Fullscreen'
            document.querySelector(".ButtonContainer").append(fullscreenbutton)

            document.getElementById("Play").setAttribute('disabled', '')

            const Iframe = SetElementTemporary(document.createElement("iframe"))
            fullscreenbutton.onclick = function(){Iframe.requestFullscreen()}
            GetHtmlBlob().then((blob) => {Iframe.src = blob, URL.revokeObjectURL(blob)})
            Hide(document.getElementById("ThumbImg"))
            document.querySelector(".Thumb").append(Iframe)
    }
    if (!document.getElementById("Play").hasAttribute("disabled")){document.getElementById("Play").onclick = ActivateIframe}
    if (!document.getElementById("Play").hasAttribute("disabled")){document.getElementById("Icon").onclick = ActivateIframe}

    if (!document.getElementById("Open").hasAttribute("disabled")){document.getElementById("Open").onclick = function(){GetHtmlBlob().then((blob) => window.open(blob))}}
    if (!document.getElementById("Download").hasAttribute("disabled")){document.getElementById("Download").onclick = function(){
        GetHtmlBlob().then((blob) => {
            const a = document.createElement('a')
            a.download = metadata.Title
            a.href = `https://www.noahsite.net/Games/${Id}/${metadata.Play}`
            a.click()
            a.remove()
            URL.revokeObjectURL(blob)
        })
    }}
    ViewPage.style.display = 'block'
}

async function LoadWebListPage(Type){
    const response = await fetch(`https://api.github.com/repos/${RepoOwner}/${Repo}/contents/${Type}`);
    if (!response.ok){
        throw new Error(`Failed to fetch ${Type} list`)
    }
    const items = await response.json();

    (DevMode ? repeatItem([], items[1], 12) : items).forEach(Item => {
        if (SkipFiles.includes(Item.name)){
            return;
        }
            fetch(`https://raw.githubusercontent.com/${RepoOwner}/${Repo}/main/${Type}/${Item.name}/metadata.json`).then((metadataresponse => {
                if (!metadataresponse.ok){
                    throw new Error(`Failed to fetch ${Type} metadata for: ${Item.name}`)
                }
                metadataresponse.json().then((metadata) => {
                    metadata.name = Item.name
                    GenerateWebListItem(metadata, Type)
                })
            }))
        }); 
WebListContainer.style.display = 'block'
}

async function LoadPage(PageId){
    SetTemporaryCSS((PageId == "Games" || PageId == "Websites") ? "WebList" : PageId).onload = function() {    
        console.log("Css loaded")
    switch (PageId){
        case 'Home':
            HomePage.style.display = 'block'
            break;

        case 'Games':
            LoadWebListPage("Games")
        break;

        case 'Websites':
            LoadWebListPage("Websites")
            break;

        case 'View':
            const Params = (new URL(location.href)).searchParams
            const Id = Params.get("Id")
            InitProjViewer(Id)
    }
}
}

window.addEventListener("hashchange", function() {
    const url = new URL(window.location.href)
    url.search = '';
    window.history.replaceState({}, '', url.href)
    
    const UrlPageQuery = (location.hash == '' ? "Home" : location.hash.replace("#", '')).split("?")[0]
    UnloadAllPages()
    LoadPage(UrlPageQuery)
  });

LoadPage((location.hash == '' ? "Home" : location.hash.replace("#", '')).split("?")[0])
