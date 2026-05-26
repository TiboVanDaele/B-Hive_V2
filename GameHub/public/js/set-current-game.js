document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".set-current-btn");
    if (!btn) return;

    btn.addEventListener("click", async () => {
        const isCurrent = btn.classList.contains("is-current");

        if (isCurrent) {
            const res = await fetch("/api/users/current-game", {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                btn.textContent = "Markeer als huidige game";
                btn.classList.remove("is-current");
            }
        } else {
            const slug = btn.dataset.slug;
            const name = btn.dataset.name;
            const image = btn.dataset.image;

            const res = await fetch("/api/users/current-game", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, name, image })
            });
            const data = await res.json();
            if (data.success) {
                btn.textContent = "Verwijder huidige game";
                btn.classList.add("is-current");
            }
        }
    });
});