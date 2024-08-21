window.onload=function(){
function updatePageContent(html, pageTitle, urlPath) {
    document.getElementById("content").innerHTML = html;
    document.title = pageTitle;
    window.history.pushState({"html":html,"pageTitle":pageTitle}, pageTitle, urlPath);
}

var anasayfa = "../templates/pages/anasayfa.html"
var siralama = '../templates/pages/siralama.html'

    document.getElementById("anasayfaBTN").addEventListener("click", function(event){
        event.preventDefault(); // Sayfanın yenilenmesini önler
        fetch(anasayfa)
            .then(response => response.text())
            .then(html => {
                updatePageContent(html, "Anasayfa", "/anasayfa");
            });
    });
    
    document.getElementById("siralamaBTN").addEventListener("click", function(event){
        event.preventDefault(); // Sayfanın yenilenmesini önler
        fetch(siralama)
            .then(response => response.text())
            .then(html => {
                updatePageContent(html, "Siralama", "/siralama");
            });
    });


// Tarayıcıdaki geri/ileri butonları kullanıldığında sayfa içeriğini günceller
window.onpopstate = function(event) {
    if(event.state){
        document.getElementById("content").innerHTML = event.state.html;
        document.title = event.state.pageTitle;
    }
};
}