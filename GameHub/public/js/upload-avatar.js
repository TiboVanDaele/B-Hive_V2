document.querySelector("#avatarUpload").addEventListener("click", async () => {
  const input = document.getElementById("avatar");
  const file = input.files[0];

  if (file.size > 10 * 1024 * 1024) {
    alert("Bestand te groot (max 10MB)");
    return;
  }

  const res = await fetch("/account/avatar", {
    method: "POST",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });

  if (res.ok) {
    alert("Avatar succesvol geüpload");
    location.reload();
  } else {
    alert("Upload mislukt");
  }
});