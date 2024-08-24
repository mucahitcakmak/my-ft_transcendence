function toggleEdit(editMode) {
    const elements = document.querySelectorAll("#username, #name,#surname,#tournamentName");
    const button = document.querySelector(".cool-btn");

    if (editMode) {
        elements.forEach((element) => {
            const input = document.createElement("input");
            input.value = element.textContent;
            input.className = "form-control";
            element.replaceWith(input);
        });
        button.textContent = "Save";
        button.onclick = () => toggleEdit(false);
    } else {
        elements.forEach((input) => {
            const td = document.createElement("td");
            td.textContent = input.value;
            input.replaceWith(td);
        });
        button.textContent = "Edit";
        button.onclick = () => toggleEdit(true);
    }
}
