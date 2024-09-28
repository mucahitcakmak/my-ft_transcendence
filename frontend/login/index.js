let userClicked = false;

loginButton.addEventListener("click", function () {
  console.log("Login button clicked!");

  if (!userClicked) {
    userClicked = true;

    fetch("http://127.0.0.1:8000/api/login/", {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login request failed.");
        }
      })
      .then((data) => {
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
        } else {
          userClicked = false;
        }
      })
      .catch((error) => {
        console.error("Error during login process:", error);
        userClicked = false;
      });
  }
});
