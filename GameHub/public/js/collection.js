const editBtn = document.querySelector(".edit-btn");
let editMode = false;

editBtn.addEventListener("click", () => {
    editMode = !editMode;

    document.querySelectorAll(".collection-card").forEach(card => {
        const slug = card.querySelector("a").href.split("/").pop();

        if (editMode) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.classList.add("delete-collection-btn");
            deleteBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const collectionId = window.location.pathname.split("/").pop();
                await fetch(`/collections/${collectionId}/remove`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ slug })
                });
                location.reload();
            });
            card.appendChild(deleteBtn);
        } else {
            card.querySelector(".delete-collection-btn")?.remove();
        }
    });
});