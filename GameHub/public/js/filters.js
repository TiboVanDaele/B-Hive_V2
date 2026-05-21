const checkboxes = document.querySelectorAll(".menu-box input[type='checkbox']");

const genreMap = {
    "cb-action": "action",
    "cb-rpg": "role-playing-games-rpg",
    "cb-fps": "shooter",
    "cb-rts": "strategy",
    "cb-sports": "sports",
    "cb-adventure": "adventure"
};

const params = new URLSearchParams(window.location.search);
const activeGenres = params.get("genres") ? params.get("genres").split(",") : [];

checkboxes.forEach(checkbox => {
    const genre = genreMap[checkbox.id];
    if (activeGenres.includes(genre)) {
        checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
        const selected = [];

        checkboxes.forEach(cb => {
            if (cb.checked && genreMap[cb.id]) {
                selected.push(genreMap[cb.id]);
            }
        });

        const url = new URL(window.location.href);
        url.searchParams.delete("genres");
        url.searchParams.delete("page");

        if (selected.length > 0) {
            url.searchParams.set("genres", selected.join(","));
        }

        window.location.href = url.toString();
    });
});