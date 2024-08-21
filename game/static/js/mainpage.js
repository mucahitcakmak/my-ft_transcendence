// TABBAR JS
document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.querySelector('.nav-indicator');
    const items = document.querySelectorAll('.nav-item');

    function handleIndicator(el) {
        items.forEach(item => {
            item.classList.remove('is-active');
            item.style.color = ''; // Renk sıfırlama
        });

        indicator.style.width = `${el.offsetWidth}px`;
        indicator.style.left = `${el.offsetLeft}px`;
        indicator.style.backgroundColor = el.getAttribute('active-color');

        el.classList.add('is-active');
        el.style.color = el.getAttribute('active-color');
    }

    function loadPageBasedOnPath(pathname) {
        if (routes[pathname]) {
            fetch(routes[pathname].contentPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    document.getElementById("content").innerHTML = html;
                    document.title = routes[pathname].title;
                    window.history.pushState(null, "", pathname); // URL'yi güncelle
                    setActiveTabFromURL(); // Tabbar'ı güncelle
                })
                .catch(error => console.error('There has been a problem with your fetch operation:', error));
        } else {
            console.error("404: Page not found for", pathname);
        }
    }

    // URL yolunu kontrol et ve uygun sekmeyi aktif hale getir
    function setActiveTabFromURL() {
        const path = window.location.pathname; // URL'nin yolunu al
        items.forEach(item => {
            const targetPath = item.getAttribute('data-target-path'); // Örneğin: /anasayfa, /siralama, /istatistikler
            if (path === targetPath) {
                handleIndicator(item); // URL yoluyla eşleşen öğeyi aktif hale getir
            }
        });
    }

    // Sayfa yüklendiğinde mevcut URL'ye göre aktif sekmeyi ayarla
    setActiveTabFromURL();

    // Tüm menü öğelerine tıklama olayını ekle
    items.forEach((item) => {
        item.addEventListener('click', e => {
            e.preventDefault(); // Sayfanın yenilenmesini önler
            const targetPath = e.target.getAttribute('data-target-path');
            loadPageBasedOnPath(targetPath); // İçeriği yükler ve tabbar'ı günceller
        });

        // Sayfa yüklendiğinde, aktif olan menü öğesi varsa bunu işaretleyin
        if (item.classList.contains('is-active')) {
            handleIndicator(item);
        }
    });

    // Tarayıcıdaki geri/ileri butonları kullanıldığında sayfa içeriğini günceller
    window.onpopstate = function () {
        loadPageBasedOnPath(window.location.pathname); // URL değiştiğinde içerik ve tabbar güncellenir
    };
});
