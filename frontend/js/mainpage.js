// TABBAR JS
document.addEventListener("DOMContentLoaded", () => {
  const indicator = document.querySelector(".nav-indicator");
  const items = document.querySelectorAll(".nav-item");
  const contentElement = document.getElementById("content");

  function handleIndicator(el) {
    // Sadece nav-item'lar için göstergeyi güncelle
    if (el.classList.contains("nav-item")) {
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
            window.history.pushState(null, "", pathname); // URL'yi güncelle
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
      console.error("404: Page not found for", pathname);
    }
  }

  function setActiveTabFromURL() {
    const path = window.location.pathname; // URL'nin yolunu al
    let matchingItem = null;

    // Ana yol ile eşleşen tab'ı bul
    items.forEach((item) => {
      const targetPath = item.getAttribute("data-target-path");
      if (path.startsWith(targetPath)) {
        // startsWith, alt başlıkları da yakalar
        matchingItem = item;
      }
    });

    if (matchingItem) {
      handleIndicator(matchingItem);
    }
  }

  setActiveTabFromURL();

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Sayfanın yenilenmesini önler
      const targetPath = item.getAttribute("data-target-path");
      loadPageBasedOnPath(targetPath); // İçeriği yükler ve tabbar'ı günceller

      handleIndicator(item); // Butona tıklanıldığında göstergede değişiklik yap
    });

    if (item.classList.contains("is-active")) {
      handleIndicator(item);
    }
  });

  window.onpopstate = function () {
    loadPageBasedOnPath(window.location.pathname); // URL değiştiğinde içerik ve tabbar güncellenir
  };
});

//Chatbox JS
document.addEventListener("DOMContentLoaded", function () {
  chatLog = document.getElementById("chat-log");
  messageInput = document.getElementById("message-input");
  sendButton = document.getElementById("send-button");
  var chatSocket = new WebSocket('ws://localhost:8000/ws/');
  
  chatSocket.onopen = function (e) {
    console.log("Connected to chat socket");
  };

  chatSocket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
  };

  chatSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    var username = data['username'];
    var messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${username}</strong>: ${message}`;
    chatLog.appendChild(messageElement);
  };
  
  sendButton.addEventListener("click", function () {
    var message = messageInput.value;
    chatSocket.send(JSON.stringify({
      'username': user_profile.username,
      'message': message
    }));
    messageInput.value = "";
  });

});