const descriptions = document.querySelectorAll(".description");
//In case there is only one game shown on screen (ex. game details)
if (descriptions.length == 1) {
    const description = document.querySelector(".description");
    const showMoreLess = document.querySelector(".show-more-less");
    
    showMoreLess.addEventListener("click", (event) => {
        if (description.classList.contains("showless")) {
            description.classList.remove("showless");
            description.classList.add("showmore");
        }
        else {
            description.classList.add("showless");
            description.classList.remove("showmore");
        }
        if (showMoreLess.innerHTML == "Toon meer") {
            showMoreLess.innerHTML = "Toon minder";
        }
        else {
            showMoreLess.innerHTML = "Toon meer";
        }
    });
}
//In case there is more than one game (two) shown on screen (ex. compare page)
else if (descriptions.length > 1) {
    const descriptionGame1 = document.querySelector(".descGame1");
    const showMoreLessGame1 = document.querySelector(".showBtnGame1");
    const descriptionGame2 = document.querySelector(".descGame2");
    const showMoreLessGame2 = document.querySelector(".showBtnGame2");
    showMoreLessGame1.addEventListener("click", (event) => {
        if (descriptionGame1.classList.contains("showless")) {
            descriptionGame1.classList.remove("showless");
            descriptionGame1.classList.add("showmore");
        }
        else {
            descriptionGame1.classList.add("showless");
            descriptionGame1.classList.remove("showmore");
        }
        if (showMoreLessGame1.innerHTML == "Toon meer") {
            showMoreLessGame1.innerHTML = "Toon minder";
        }
        else {
            showMoreLessGame1.innerHTML = "Toon meer";
        }
    });
    showMoreLessGame2.addEventListener("click", (event) => {
        if (descriptionGame2.classList.contains("showless")) {
            descriptionGame2.classList.remove("showless");
            descriptionGame2.classList.add("showmore");
        }
        else {
            descriptionGame2.classList.add("showless");
            descriptionGame2.classList.remove("showmore");
        }
        if (showMoreLessGame2.innerHTML == "Toon meer") {
            showMoreLessGame2.innerHTML = "Toon minder";
        }
        else {
            showMoreLessGame2.innerHTML = "Toon meer";
        }
    });
}