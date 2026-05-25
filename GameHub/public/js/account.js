"use strict";
const editBtn = document.getElementById("editProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");
const editCard = document.getElementById("editProfileCard");
function showEditForm() {
    editCard.style.display = "block";
    editBtn.style.display = "none";
}
function hideEditForm() {
    editCard.style.display = "none";
    editBtn.style.display = "inline-block";
}
editBtn.addEventListener("click", showEditForm);
cancelBtn.addEventListener("click", hideEditForm);
