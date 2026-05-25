const editBtn = document.getElementById("editProfileBtn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancelEditBtn") as HTMLButtonElement;
const editCard = document.getElementById("editProfileCard") as HTMLElement;

function showEditForm(): void {
    editCard.style.display = "block";
    editBtn.style.display = "none";
}

function hideEditForm(): void {
    editCard.style.display = "none";
    editBtn.style.display = "inline-block";
}

editBtn.addEventListener("click", showEditForm);
cancelBtn.addEventListener("click", hideEditForm);
