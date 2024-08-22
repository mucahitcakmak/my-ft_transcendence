// URL yapılarını ve içeriklerini yönetmek için bir nesne tanımlayalım
const routes = {
    "/home": { title: "Home", contentPath: "../templates/pages/home.html" },

    // alt dalları denemek için test ediliyor. şuanda html dosyası bulunmuyor.
    "/home/play-against-ai": { title: "Play Against AI", contentPath: "../templates/pages/play-against-ai.html" },
    
    "/leaderboard": { title: "Leaderboard", contentPath: "../templates/pages/leaderboard.html" },
    "/statistics": { title: "Statistics", contentPath: "../templates/pages/statistics.html" },
    "/friends": { title: "Friends", contentPath: "../templates/pages/friends.html" },
    "/profile": { title: "Profile", contentPath: "../templates/pages/profile.html" },
};


window.onload = function () {
    function updatePageContent(html, pageTitle, urlPath) {
        document.getElementById("content").innerHTML = html;
        document.title = pageTitle;
        window.history.pushState({ "html": html, "pageTitle": pageTitle }, pageTitle, urlPath);
    }

    function loadPageBasedOnPath(pathname) {
        // pathName için doğru yönlendirmeyi kontrol ediyoruz
        if (routes[pathname]) {
            fetch(routes[pathname].contentPath)
                .then(response => response.text())
                .then(html => {
                    updatePageContent(html, routes[pathname].title, pathname);
                });
        } else {
            console.error("404: Page not found");
            // Buraya 404 sayfası için bir içerik yükleyebilirsiniz
        }
    }

    // Tıklama olaylarını dinamik olarak yönetiyoruz
    document.querySelectorAll("[data-url]").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); // Sayfanın yenilenmesini önler
            const urlPath = this.getAttribute("data-url");
            loadPageBasedOnPath(urlPath);
        });
    });

    // Sayfa yüklendiğinde mevcut path'i kontrol et
    loadPageBasedOnPath(window.location.pathname);

    // Tarayıcıdaki geri/ileri butonları kullanıldığında sayfa içeriğini günceller
    window.onpopstate = function (event) {
        if (event.state) {
            document.getElementById("content").innerHTML = event.state.html;
            document.title = event.state.pageTitle;
        }
    };
};
