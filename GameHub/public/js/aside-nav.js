const asideNavWrapper = document.querySelector(".aside-nav-wrapper");
const menuButton = document.querySelector(".menu-button");
const hiddenToggle = document.querySelector(".hidden");

menuButton.addEventListener("click", event => {
    if(menuButton.classList.contains("fa-bars")){
        menuButton.classList.replace("fa-bars", "fa-x");
        
    }
    else{
        menuButton.classList.replace("fa-x", "fa-bars");
    }
    hiddenToggle.classList.toggle("hidden");
    asideNavWrapper.classList.toggle("open");
})
