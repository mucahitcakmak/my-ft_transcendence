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
      
      // İlk olarak aktif olan menü öğesi için de fonksiyonu çalıştırın
      items.forEach((item) => {
        item.addEventListener('click', e => {handleIndicator(e.target);});
        if (item.classList.contains('is-active')) {
          handleIndicator(item);
        }
      });
  });
