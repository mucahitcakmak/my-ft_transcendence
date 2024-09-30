user_profile = {};
token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  const indicator = document.querySelector(".nav-indicator");
  const contentElement = document.getElementById("content");
  const urlParams = new URLSearchParams(window.location.search);
  let token = localStorage.getItem("token");

  if (urlParams.has("token")) {
    token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage:", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      console.log("No token found in URL.");
      window.location.href = "/login/index.html";
      return;
    }
  }

  if (!token) {
    window.location.href = "/login/index.html";
    return;
  }

  fetch("http://127.0.0.1:8000/api/home/", {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to check authentication.");
      }
    })
    .then((data) => {
      if (!data.is_authenticated) {
        window.location.href = "/login/index.html";
      } else {
        user_profile = data["user"];
        console.log(data);
      }
    })
    .catch((error) => {
      console.error("Error during authentication check:", error);
      window.location.href = "/login/index.html";
    });

  function handleIndicator(el) {
    if (el.classList.contains("nav-item")) {
      const items = document.querySelectorAll(".nav-item"); // Yeni nav-item'ları da dahil et
      items.forEach((item) => {
        item.classList.remove("is-active");
        item.style.color = ""; // Renk sıfırlama
      });

      indicator.style.width = `${el.offsetWidth}px`;
      indicator.style.left = `${el.offsetLeft}px`;
      indicator.style.backgroundColor = el.getAttribute("active-color");

      el.classList.add("is-active");
      el.style.color = el.getAttribute("active-color");
    }
  }

  function loadPageBasedOnPath(pathname) {
    if (routes[pathname]) {
      fetch(routes[pathname].contentPath)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((html) => {
          contentElement.classList.remove("fade-in"); // Animasyonu sıfırla
          contentElement.style.opacity = 0; // Sayfa yüklendiğinde transparan yap

          setTimeout(() => {
            contentElement.innerHTML = html;
            document.title = routes[pathname].title;
            window.history.pushState(null, "", pathname);

            console.log("tokenm: ", token);
            if (pathname === "/profile") {
              document.getElementsByClassName("picture")[0].src =
                user_profile.profile_picture;
              document.getElementsByClassName("name")[0].textContent =
                user_profile.first_name;
              document.getElementsByClassName("surname")[0].textContent =
                user_profile.last_name;
            } else if (pathname === "/friends") {
              friend();
            }
            var elements = document.getElementsByClassName("username");
            for (var i = 0; i < elements.length; i++) {
              elements[i].textContent = user_profile.username;
            }
            document.getElementsByClassName("panel-pic")[0].src =
              user_profile.profile_picture;

            setActiveTabFromURL(); // Tabbar'ı güncelle

            // Animasyonu başlat
            contentElement.classList.add("fade-in");
            contentElement.style.opacity = 1; // Sayfa içeriğini yavaşça göster
          }, 100);
        })
        .catch((error) =>
          console.error(
            "There has been a problem with your fetch operation:",
            error
          )
        );
    } else {
      // Eğer route bulunmuyorsa 404 sayfasını yükle
      fetch("pages/404.html")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((html) => {
          contentElement.classList.remove("fade-in"); // Animasyonu sıfırla
          contentElement.style.opacity = 0; // Sayfa yüklendiğinde transparan yap

          setTimeout(() => {
            contentElement.innerHTML = html;
            document.title = "404 - Page Not Found";
            window.history.pushState(null, "", pathname); // URL'yi yine de güncelle

            contentElement.classList.add("fade-in");
            contentElement.style.opacity = 1; // Sayfa içeriğini yavaşça göster
          }, 100);
        })
        .catch((error) =>
          console.error(
            "There has been a problem with your fetch operation:",
            error
          )
        );
    }
  }

  function setActiveTabFromURL() {
    const path = window.location.pathname;
    const items = document.querySelectorAll(".nav-item, [data-url-path]");
    let matchingItem = null;

    items.forEach((item) => {
      const targetPath =
        item.getAttribute("data-target-path") ||
        item.getAttribute("data-url-path");
      if (targetPath === path) {
        matchingItem = item;
      }
    });

    if (matchingItem) {
      handleIndicator(matchingItem);
    }
  }

  // MutationObserver ile dinamik olarak eklenen elemanları izleyin
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const items = document.querySelectorAll(".nav-item, [data-url-path]");
        items.forEach((item) => {
          item.removeEventListener("click", handleItemClick);
          item.addEventListener("click", handleItemClick);
          if (item.classList.contains("is-active")) {
            handleIndicator(item);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function handleItemClick(e) {
    e.preventDefault();
    const targetPath =
      this.getAttribute("data-target-path") ||
      this.getAttribute("data-url-path");
    if (targetPath) {
      loadPageBasedOnPath(targetPath);
      handleIndicator(this);
    }
  }

  setActiveTabFromURL();
  loadPageBasedOnPath(window.location.pathname);

  window.onpopstate = function (event) {
    if (event.state) {
      contentElement.classList.remove("show");

      setTimeout(() => {
        contentElement.innerHTML = event.state.html;
        document.title = event.state.pageTitle;

        contentElement.classList.add("show");
      }, 150);
    } else {
      loadPageBasedOnPath(window.location.pathname);
    }
  };
});
