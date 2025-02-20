const SearchBar = document.querySelector(".ItemList input")
const ItemList = document.querySelector(".ItemList ul")

SearchBar.addEventListener("input", function(event){
    const Value = this.value
    
    Array.from(ItemList.children).forEach(element => {
        console.log(element.children[1].textContent.includes(Value))
        if (element.children[1].textContent.includes(Value)){
            element.classList.remove("hidden")
        }else{
            element.classList.add("hidden")
        }
    });
})