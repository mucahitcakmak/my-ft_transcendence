document.addEventListener("DOMContentLoaded", function () {
document.getElementById("findFriendSearch").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const inputValue = this.value.trim();
        if (inputValue) {
            const newPath = `/user/${inputValue}`;
            window.location.href = newPath;
        }
    }
});
});

async function findUserAndGetData(username, auth_token) {
    return fetch(`http://127.0.0.1:8000/users`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Token ${auth_token}`,
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Verilere erişilemiyor!");
            return null;
        }
    })
    .then(data => {
        if (data) {
            const userFound = data.find(user => user.username === username);
            return userFound;
        } else {
            return null;
        }
    })
    .catch(error => {
        console.log("Kullanıcı bulunamadı!", error);
        return null;
    });
}