const selectedGames = [];

const compareButtons = document.querySelectorAll(".compare-btn");
const compareSlots = document.querySelectorAll(".compare-slot");
const comparePageBtn = document.getElementById("comparePageBtn");
const compareBar = document.getElementById("compareBar");

compareButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const game = {
            name: button.dataset.name,
            image: button.dataset.image,
            slug: button.dataset.slug
        };

        const alreadySelected = selectedGames.some(selectedGame => selectedGame.slug === game.slug);

        if (alreadySelected || selectedGames.length >= 2) {
            return;
        }

        selectedGames.push(game);
        renderCompareBar();
    });
});

function renderCompareBar() {
    compareSlots.forEach((slot, index) => {
        const game = selectedGames[index];

        if (!game) {
            slot.classList.remove("filled");
            slot.innerHTML = `<p>Game ${index + 1}</p>`;
            return;
        }

        slot.classList.add("filled");
        slot.innerHTML = `
            <button class="remove-compare-btn" type="button" data-index="${index}">×</button>
            <img src="${game.image}" alt="${game.name}">
            <h3>${game.name}</h3>
        `;
    });

    const removeButtons = document.querySelectorAll(".remove-compare-btn");

    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            selectedGames.splice(index, 1);
            renderCompareBar();
        });
    });

    if (selectedGames.length === 0) {
        compareBar.classList.remove("active");
    } else {
        compareBar.classList.add("active");
    }

    if (selectedGames.length === 2) {
        comparePageBtn.href = `/compare?game1=${selectedGames[0].slug}&game2=${selectedGames[1].slug}`;
    } else {
        comparePageBtn.href = "/compare";
    }
}