let currentSlug = "";

const modal = document.getElementById("addModal");
const select = document.getElementById("collectionSelect");
const nameInput = document.getElementById("newCollectionName");
const confirmBtn = document.getElementById("addConfirm");
const cancelBtn = document.getElementById("addCancel");

select.addEventListener("change", () => {
    nameInput.style.display = select.value === "nieuw" ? "block" : "none";
});

if(document.title == "GameHub"){
document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        currentSlug = btn.closest(".game-card").querySelector(".compare-btn").dataset.slug;

        const res = await fetch("/collections/api");
        const collections = await res.json();

        select.innerHTML = '<option value="nieuw">+ Nieuwe collectie</option>';
        collections.forEach(col => {
            const option = document.createElement("option");
            option.value = col._id;
            option.textContent = col.name;
            select.appendChild(option);
        });

        nameInput.style.display = "block";
        nameInput.value = "";
        modal.style.display = "block";
    });
});
}
else{
    const collectionBtn = document.querySelector(".collection-btn");
    if(collectionBtn.classList.contains("in-collection")){
        currentSlug = collectionBtn.dataset.name;
        collectionBtn.addEventListener("click", async(e) =>{
            let result = await fetch(`/collections/${currentSlug}/removeFromAll`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: currentSlug })
            });
            location.reload();
        });
        
    }

    else{
        collectionBtn.addEventListener("click", async (e) =>{
        e.preventDefault;
        e.stopPropagation;

        currentSlug = window.location.pathname.split("/").pop();

        const res = await fetch("/collections/api");
        const collections = await res.json();

        select.innerHTML = '<option value="nieuw">+ Nieuwe collectie</option>';
        collections.forEach(col => {
            const option = document.createElement("option");
            option.value = col._id;
            option.textContent = col.name;
            select.appendChild(option);
        });

        nameInput.style.display = "block";
        nameInput.value = "";
        modal.style.display = "block";
    });
    }
}
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

confirmBtn.addEventListener("click", async () => {
    const keuze = select.value;

    if (keuze === "nieuw") {
        const naam = nameInput.value.trim();
        if (!naam) return;

        await fetch("/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: naam })
        });
    } else {
        await fetch(`/collections/${keuze}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: currentSlug })
        });
    }

    modal.style.display = "none";
    location.reload();
});