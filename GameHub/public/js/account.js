const editBtn = document.getElementById("editProfileBtn");
const cancelBtn = document.getElementById("cancelEditBtn");
const editCard = document.getElementById("editProfileCard");

function showEditForm() {
    editCard.classList.add("active");
    editBtn.style.display = "none";
}

function hideEditForm() {
    editCard.classList.remove("active");
    editBtn.style.display = "";
}

editBtn.addEventListener("click", showEditForm);
cancelBtn.addEventListener("click", hideEditForm);