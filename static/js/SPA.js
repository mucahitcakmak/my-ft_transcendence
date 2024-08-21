// URL yapılarını ve içeriklerini yönetmek için bir nesne tanımlayalım
const routes = {
    "/anasayfa": { title: "Anasayfa", contentPath: "../templates/pages/anasayfa.html" },

    // alt dalları denemek için test ediliyor. şuanda html dosyası bulunmuyor.
    "/anasayfa/yz-ile-oyna": { title: "YZ ile Oyna", contentPath: "../templates/pages/yz-ile-oyna.html" },
    
    "/siralama": { title: "Siralama", contentPath: "../templates/pages/siralama.html" },
    "/istatistikler": { title: "Istatistikler", contentPath: "../templates/pages/istatistikler.html" },
    "/arkadaslar": { title: "Arkadaslar", contentPath: "../templates/pages/arkadaslar.html" },
    "/profil": { title: "Profil", contentPath: "../templates/pages/profil.html" },
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
