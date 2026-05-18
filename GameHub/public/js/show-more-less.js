const descriptionGame1 = document.querySelector(".descGame1");
const showMoreLessGame1 = document.querySelector(".showBtnGame1");

const descriptionGame2 = document.querySelector(".descGame2");
const showMoreLessGame2 = document.querySelector(".showBtnGame2");

showMoreLessGame1.addEventListener("click", (event) => {
    if(descriptionGame1.classList.contains("showless")){
        descriptionGame1.classList.remove("showless");
        descriptionGame1.classList.add("showmore");
    }
    else{
        descriptionGame1.classList.add("showless");
        descriptionGame1.classList.remove("showmore");
    }
    if(showMoreLessGame1.innerHTML == "Toon meer"){
        showMoreLessGame1.innerHTML = "Toon minder";
    }
    else{
        showMoreLessGame1.innerHTML="Toon meer";
    }
});

showMoreLessGame2.addEventListener("click", (event) => {
    if(descriptionGame2.classList.contains("showless")){
        descriptionGame2.classList.remove("showless");
        descriptionGame2.classList.add("showmore");
    }
    else{
        descriptionGame2.classList.add("showless");
        descriptionGame2.classList.remove("showmore");
    }
    if(showMoreLessGame2.innerHTML == "Toon meer"){
        showMoreLessGame2.innerHTML = "Toon minder";
    }
    else{
        showMoreLessGame2.innerHTML="Toon meer";
    }
});