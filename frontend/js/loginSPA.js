let loadedScripts = [];
let lastData;
// Sayfa içeriğini fetch ile yükle
function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            console.log(pageUrl);
            if (lastData == pageUrl) {
                console.log("tekrar giremezsin asko");
                return;
            } else {
                console.log("farklı bir deneme yaptığın için dataları temizledim!");
                removeLoadedScripts();
            }
            document.getElementById('pageBody').innerHTML = html;
            console.log("html dosyalarını yükledim!");
            if (pageUrl == "/pages/login/login.html") {
                forLogin();
            }
            else {
                forLoggedIn(); // Scriptleri yükle
            }

            lastData = pageUrl;
        });
}

// Tüm external scriptleri sırayla yükleyen fonksiyon
function forLoggedIn() {
    scriptsLoaded = true;
    loadExternalScript('https://code.jquery.com/jquery-3.5.1.slim.min.js')
    .then(() => loadExternalScript('https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js'))
    .then(() => loadExternalScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js'))
    .then(() => loadExternalScript('/js/routes.js'))
    .then(() => loadExternalScript('/js/mylib.js'))
    .then(() => loadExternalScript('/js/SPA.js'))
    .then(() => loadExternalScript('/js/mainpage.js'))
    .then(() => loadExternalScript('/js/mainpage_chat.js'))
    .then(() => loadExternalScript('/js/leaderboard.js'))
    .then(() => loadExternalScript('/js/friends.js'))
    .then(() => loadExternalScript('/js/profile.js'))
    .then(() => loadExternalScript('/js/statistics.js'))
    .then(() => loadExternalScript('/js/matchs-history.js'))
    .then(() => loadExternalScript('/js/base_background.js'))
    .then(() => {
        // Tüm scriptler yüklendikten sonra DOMContentLoaded olayını manuel tetikle
        const event = new Event('DOMContentLoaded', {
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    })
    .catch(error => {
        console.error('Bir script yüklenirken hata oluştu:', error);
    });
}

function forLogin() {
    scriptsLoaded = true;
    loadExternalScript('https://code.jquery.com/jquery-3.5.1.slim.min.js')
    .then(() => loadExternalScript('https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js'))
    .then(() => loadExternalScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js'))
    .then(() => loadExternalScript('/js/login.js'))
    .then(() => {
        // Tüm scriptler yüklendikten sonra DOMContentLoaded olayını manuel tetikle
        const event = new Event('DOMContentLoaded', {
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    })
    .catch(error => {
        console.error('Bir script yüklenirken hata oluştu:', error);
    });
}

// Dinamik olarak external scriptleri yükleyen fonksiyon
function loadExternalScript(scriptUrl) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;

        script.onload = () => {
            loadedScripts.push(script); // Yüklenen scripti kaydet
            resolve(); // Başarılıysa resolve et
        };

        script.onerror = () => {
            console.error(`Failed to load ${scriptUrl}`);
            reject(new Error(`Failed to load ${scriptUrl}`)); // Hata durumunda reject et
        };

        document.body.appendChild(script); // Script'i body'e ekle ve çalıştır
    });
}

// Scriptleri kaldıran fonksiyon
function removeLoadedScripts() {
    loadedScripts.forEach(script => {
        document.body.removeChild(script); // Script etiketini kaldır
    });
    loadedScripts = []; // Diziyi temizle
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let token = localStorage.getItem("token");
    
    if (urlParams.has("token")) {
        token = urlParams.get("token");
        if (token) {
          console.log("2");
          localStorage.setItem("token", token);
          console.log("Token stored in localStorage:", token);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            console.log("3");
            console.log("No token found in URL.");
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
                loadPage("/pages/login/login.html");
            }
          return;
        }
    }
    
    // If not logged in, redirect to login page
    if (!token) {
        loadPage("/pages/login/login.html");
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
        }
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
        console.log("8");
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to check authentication.");
        }
    })
    .then((data) => {
        if (!data.is_authenticated) {
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
                loadPage("/pages/login/login.html");
            }
        } else {
            console.log("10");
            if (window.location.pathname !== "/home") {
                window.location.href = "/home";
            }
            loadPage("/pages/login/logged-in.html");
            user_profile = data["user"];
            console.log(data);
        }
    })
    .catch((error) => {
        console.error("Error during authentication check:", error);
        if (window.location.pathname !== "/login") {
            window.location.href = "/login";
            loadPage("/pages/login/login.html");
        }
      });

});
