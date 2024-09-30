let userClicked = false;
let isRegister = false;

loginButton.addEventListener("click", function () {
  console.log("Login button clicked!");

  if (!userClicked) {
    userClicked = true;

    fetch("http://127.0.0.1:8000/api/login-auth/", {
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

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (isRegister) {
    var email = document.getElementById("email").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var name = document.getElementById("name").value;
    var surname = document.getElementById("surname").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    var data = {
      username: username,
      email: email,
      first_name: name,
      last_name: surname,
      password: password,
      password_confirm: confirmPassword,
    };

    fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User created successfully") {
          alert("Successfully registered!");
          setTimeout(function () {
            window.location.reload();
          }, 1000);
        } else if (data.username) {
          alert("error: " + data.username);
        } else if (data.email) {
          alert("error: " + data.email);
        } else {
          alert("error: cannot register");
        }
      });
  } else {
    var data = {
      username: username,
      password: password,
    };

    fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          window.location.href = data.redirect_url;
        } else {
          alert("cannot login");
        }
      });
  }
});

document
  .getElementById("registerButton")
  .addEventListener("click", function (e) {
    e.preventDefault();
    isRegister = true;

    document.getElementById("loginForm").innerHTML = `
      <div class="mb-3">
          <label for="username" class="form-label text-white">Username</label>
          <input type="text" class="form-control" id="username">
      </div>
      <div class="mb-3">
          <label for="email" class="form-label text-white">Email</label>
          <input type="email" class="form-control" id="email">
      </div>
      <div class="mb-3">
          <label for="name" class="form-label text-white">Name</label>
          <input type="text" class="form-control" id="name">
      </div>
      <div class="mb-3">
          <label for="surname" class="form-label text-white">Surname</label>
          <input type="text" class="form-control" id="surname">
      </div>
      <div class="mb-3">
          <label for="password" class="form-label text-white">Password</label>
          <input type="password" class="form-control" id="password">
      </div>
      <div class="mb-3">
          <label for="confirmPassword" class="form-label text-white">Confirm Password</label>
          <input type="password" class="form-control" id="confirmPassword">
      </div>
      <div class="buttons">
        <button type="submit" class="btn btn-primary mb-4">Register</button>
        <a href="#" id="switchToLogin" class="button2">Back to Login</a>
      </div>
  `;
    document.getElementById("registerButton").style.display = "none";
    document
      .getElementById("switchToLogin")
      .addEventListener("click", function (e) {
        e.preventDefault();
        isRegister = false;
        document.getElementById("loginForm").innerHTML = `
        <div class="mb-3">
          <label for="username" class="form-label text-white">Username</label>
          <input type="text" class="form-control" id="username">
        </div>
        <div class="mb-3">
          <label for="password" class="form-label text-white">Password</label>
          <input type="password" class="form-control" id="password">
        </div>
        <div class="buttons">
          <button type="submit" class="btn btn-primary mb-4">Login</button>
				</div>
    `;
        document.getElementById("registerButton").style.display = "block";
      });
  });
