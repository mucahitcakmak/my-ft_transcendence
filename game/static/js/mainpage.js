// TABBAR JS
document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.querySelector('.nav-indicator');
    const items = document.querySelectorAll('.nav-item');
    const contentElement = document.getElementById('content');

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
                    contentElement.classList.remove('fade-in');  // Animasyonu sıfırla
                    contentElement.style.opacity = 0;  // Sayfa yüklendiğinde transparan yap

                    setTimeout(() => {
                        contentElement.innerHTML = html;
                        document.title = routes[pathname].title;
                        window.history.pushState(null, "", pathname); // URL'yi güncelle
                        setActiveTabFromURL(); // Tabbar'ı güncelle

                        // Animasyonu başlat
                        contentElement.classList.add('fade-in');
                        contentElement.style.opacity = 1;  // Sayfa içeriğini yavaşça göster
                    }, 100);
                })
                .catch(error => console.error('There has been a problem with your fetch operation:', error));
        } else {
            console.error("404: Page not found for", pathname);
        }
    }

    function setActiveTabFromURL() {
        const path = window.location.pathname; // URL'nin yolunu al
        items.forEach(item => {
            const targetPath = item.getAttribute('data-target-path'); // Örneğin: /home, /leaderboard, /statistics
            if (path === targetPath) {
                handleIndicator(item); // URL yoluyla eşleşen öğeyi aktif hale getir
            }
        });
    }

    setActiveTabFromURL();

    items.forEach((item) => {
        item.addEventListener('click', e => {
            e.preventDefault(); // Sayfanın yenilenmesini önler
            const targetPath = item.getAttribute('data-target-path');
            loadPageBasedOnPath(targetPath); // İçeriği yükler ve tabbar'ı günceller

            handleIndicator(item); // Butona tıklanıldığında göstergede değişiklik yap
        });

        if (item.classList.contains('is-active')) {
            handleIndicator(item);
        }
    });

    window.onpopstate = function () {
        loadPageBasedOnPath(window.location.pathname); // URL değiştiğinde içerik ve tabbar güncellenir
    };
});

