document.addEventListener("DOMContentLoaded", () => {
    const dropdownTrigger = document.querySelector('.match-general-chat-btn');
    const dropdownMenu = document.querySelector('.match-dropdown-menu');

    dropdownTrigger.addEventListener('click', function() {
        // Force a reflow by reading a property before toggling the class
        const triggerRect = dropdownTrigger.getBoundingClientRect();

        dropdownMenu.style.left = `${-300}px`;
        dropdownMenu.style.transform = 'translate(0px, 0px)';
        dropdownMenu.classList.toggle('show');
    });
});
