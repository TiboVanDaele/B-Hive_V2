const inputSearchbar = document.querySelector(".searchbar input[type='search']");
const formSearchbar = document.querySelector(".searchbar form");

const dropdown = document.createElement("ul");
dropdown.classList.add("autocomplete-dropdown");
formSearchbar.appendChild(dropdown);

inputSearchbar.addEventListener("input", async () => {
    const query = inputSearchbar.value.trim();

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

if (document.title == "Vergelijk games") {
    const inputsGameCompare = document.querySelectorAll(".search-input");
    const inputWrappers = document.querySelectorAll(".input-wrapper");

    let counter = 0;
    inputsGameCompare.forEach(input => {
        const dropdownCompare = document.createElement("ul");
        dropdownCompare.id = "dropdownGame" + (counter + 1);
        dropdownCompare.classList.add("autocomplete-dropdown-compare");
        dropdownCompare.style.display="none";
        inputWrappers[counter].appendChild(dropdownCompare);

        input.addEventListener("input", async () => {
            const query = input.value.trim();

            if (query.length < 2) {
                dropdownCompare.innerHTML = "";
                dropdownCompare.style.display = "none";
                return;
            }

            const res = await fetch(`/suggestions?q=${encodeURIComponent(query)}`);
            const suggestions = await res.json();

            dropdownCompare.innerHTML = "";

            if (suggestions.length === 0) {
                dropdownCompare.style.display = "none";
                return;
            }

            suggestions.forEach(game => {
                const li = document.createElement("li");
                li.textContent = game.name;
                li.addEventListener("click", () => {
                    input.value = game.slug;
                    dropdownCompare.style.display = "none";
                });


                dropdownCompare.appendChild(li);
            });
            
            dropdownCompare.style.display = "block";
        });

        counter++;
    });

     document.addEventListener("click", (e) => {
        inputWrappers.forEach(wrapper => {
            if (!wrapper.contains(e.target)) {
                const dropdown = wrapper.querySelector(".autocomplete-dropdown-compare");
                if (dropdown) {
                    dropdown.style.display = "none";
                }
            }
        });
    });
}


document.addEventListener("click", (e) => {
    if (!formSearchbar.contains(e.target)) {
        dropdown.style.display = "none";
    }
});