function toggleEdit(editMode) {
  const elements = document.querySelectorAll(
    "#username, #name, #surname, #gamename"
  );
  const button = document.querySelector(".cool-btn");

  if (editMode) {
    elements.forEach((element) => {
      const input = document.createElement("input");
      input.value = element.textContent;
      input.className = "form-control";
      input.setAttribute("data-id", element.id);
      input.id = element.id;
      element.replaceWith(input);
    });
    button.textContent = "Save";
    button.onclick = () => toggleEdit(false);
  } else {
    elements.forEach((input) => {
      const td = document.createElement("td");
      td.textContent = input.value;
      td.id = input.getAttribute("data-id");
      input.replaceWith(td);
    });
    button.textContent = "Edit";
    button.onclick = () => toggleEdit(true);
  }
}

function logout() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found. Redirecting to login page.");
    window.location.href = "/login/index.html";
    return;
  }

  fetch("http://127.0.0.1:8000/api/logout/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login/index.html";
      } else {
        throw new Error("Logout request failed.");
      }
    })
    .catch((error) => {
      console.error("Error during logout process:", error);
      window.location.href = "/login/index.html";
    });
}
