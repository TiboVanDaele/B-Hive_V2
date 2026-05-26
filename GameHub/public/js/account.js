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

const removeBtn = document.getElementById("removeCurrentBtn");
if (removeBtn) {
    removeBtn.addEventListener("click", async () => {
        const res = await fetch("/api/users/current-game", {
            method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
            document.querySelector(".current-game-card").remove();
        }
    });
}
editBtn.addEventListener("click", showEditForm);
cancelBtn.addEventListener("click", hideEditForm);