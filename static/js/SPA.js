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
        const contentElement = document.getElementById("content");
        
        // Önce içeriğin görünürlüğünü sıfırla
        contentElement.classList.remove("show");
        
        // Yeni içeriği yükle
        contentElement.innerHTML = html;
        document.title = pageTitle;
        window.history.pushState({ "html": html, "pageTitle": pageTitle }, pageTitle, urlPath);
        
        // Yüklemeden hemen sonra fade-in animasyonunu tetikle
        setTimeout(() => {
            contentElement.classList.add("show");
        }, 10); // 10ms gecikme ile animasyonu başlat
    }

    function loadPageBasedOnPath(pathname) {
        if (routes[pathname]) {
            fetch(routes[pathname].contentPath)
                .then(response => response.text())
                .then(html => {
                    updatePageContent(html, routes[pathname].title, pathname);
                });
        } else {
            console.error("404: Page not found");
        }
    }

    document.querySelectorAll("[data-url]").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault(); 
            const urlPath = this.getAttribute("data-url");
            loadPageBasedOnPath(urlPath);
        });
    });

    loadPageBasedOnPath(window.location.pathname);

    window.onpopstate = function (event) {
        if (event.state) {
            const contentElement = document.getElementById("content");
            contentElement.classList.remove("show");
            contentElement.innerHTML = event.state.html;
            document.title = event.state.pageTitle;
            setTimeout(() => {
                contentElement.classList.add("show");
            }, 10);
        }
    };
};