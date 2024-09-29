document.addEventListener("DOMContentLoaded", () => {

    /* CHAT DROPDOWN */
    const dropdownTrigger = document.querySelector('.match-general-chat-btn');
    const dropdownMenu = document.querySelector('.match-dropdown-menu');

    dropdownTrigger.addEventListener('click', function() {
        // Force a reflow by reading a property before toggling the class
        const triggerRect = dropdownTrigger.getBoundingClientRect();

        dropdownMenu.style.left = `${-17}vw`;
        dropdownMenu.style.transform = 'translate(0px, 0px)';
        dropdownMenu.classList.toggle('show');
    });




    function getChatData(data, chat_id) {
        return id = data.find(chat => chat.id === chat_id);
    }

    /* CHAT JSON CONNECT */
    fetch('/data_samples/user_data.json') // Kullanıcıya bağlan ve içerisindeki chat_id leri çek
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json(); // Yanıtı JSON formatına çevir
    })
    .then(data => {

        const my_userid = data[0].id;
        const my_chatids = data[0].chats; // mucox'in chats_idleri
        
        fetch('/data_samples/chats.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                }
            return response.json();
        })
        .then(data => {
            
            const my_chats = data.filter(chat_element => my_chatids.includes(chat_element.chat_id));
            console.log(my_chats);
            
            const chatList = document.getElementById("chat-list");

            // BURADA KALDIM

            const chatItem = document.createElement("li");
            chatItem.className = "match-dropdown-item d-flex align-items-center";
            chatItem.innerHTML = `
                <img src="${chatData[i].imgSrc}" class="chat-img shadow me-2" alt="Profile Image">
                <a class="">${chatData[i].name}</a>
            `;
            chatList.appendChild(chatItem);
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });




    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });



});
