const desc = document.querySelector(".description");
const btn = document.querySelector(".show-more-less");

btn.addEventListener("click", () => {
  const isCollapsed = desc.classList.contains("showless");

  if (isCollapsed) {
    desc.classList.remove("showless");
    desc.classList.add("showmore");
    btn.textContent = "Toon minder";
  } else {
    desc.classList.add("showless");
    desc.classList.remove("showmore");
    btn.textContent = "Toon meer";
  }
});