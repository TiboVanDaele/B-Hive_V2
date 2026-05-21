const createBtn = document.querySelector(".create-collection-btn");
const editBtn = document.querySelector(".edit-btn");
const modal = document.getElementById("createModal");
const confirmBtn = document.getElementById("createConfirm");
const cancelBtn = document.getElementById("createCancel");
const nameInput = document.getElementById("newCollectionName");

createBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
});

cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

confirmBtn.addEventListener("click", async () => {
    const naam = nameInput.value.trim();
    if (!naam) return;

    await fetch("/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: naam })
    });

    modal.classList.remove("active");
    location.reload();
});

let editMode = false;
editBtn.addEventListener("click", () => {
    editMode = !editMode;

    document.querySelectorAll(".collection-card").forEach(card => {
        const id = card.querySelector("a").href.split("/").pop();

        if (editMode) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.classList.add("delete-collection-btn");
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                await fetch(`/collections/${id}`, { method: "DELETE" });
                location.reload();
            });
            card.appendChild(deleteBtn);
        } else {
            card.querySelector(".delete-collection-btn")?.remove();
        }
    });
});