const input = document.querySelector(".searchbar input[type='search']");
const form = document.querySelector(".searchbar form");

const dropdown = document.createElement("ul");
dropdown.classList.add("autocomplete-dropdown");
form.appendChild(dropdown);

input.addEventListener("input", async () => {
    const query = input.value.trim();

    if (query.length < 2) {
        dropdown.innerHTML = "";
        dropdown.style.display = "none";
        return;
    }

    const res = await fetch(`/suggestions?q=${encodeURIComponent(query)}`);
    const suggestions = await res.json();

    dropdown.innerHTML = "";

    if (suggestions.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    suggestions.forEach(game => {
        const li = document.createElement("li");
        li.textContent = game.name;
        li.addEventListener("click", () => {
            window.location.href = `/game/${game.slug}`;
        });
        dropdown.appendChild(li);
    });

    dropdown.style.display = "block";
});

document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
        dropdown.style.display = "none";
    }
});