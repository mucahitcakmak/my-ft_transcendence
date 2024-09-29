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



    /* CHAT JSON CONNECT */
    fetch('/data_samples/user_data.json')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {

        const user_data  = data;
        const my_user = data[0];
        const my_chatids = data[0].chats; 
        
        fetch('/data_samples/chats.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
                }
            return response.json();
        })
        .then(data => {
            
            const my_chats = data.filter(chat_element => my_chatids.includes(chat_element.chat_id));
            
            my_chats.forEach(chatData => {
                const other_user = chatData.participants.find(nbr => nbr !== my_user.id);
                const other_user_data = user_data.find(user => user.id == other_user);

                const chatList = document.getElementById("chat-list");
                const chatItem = document.createElement("li");
                chatItem.className = "match-dropdown-item d-flex align-items-center";
                chatItem.onclick = () => loadChat(chatItem);
                chatItem.innerHTML = `
                <img src="${other_user_data.profile.profile_picture}" class="chat-img shadow me-2" alt="Profile Image">
                <a class="${chatData.chat_id}">${other_user_data.username}</a>
                `;
                chatList.appendChild(chatItem);
            });

            function loadChat (chatItem) {
                const chat_id = chatItem.querySelector('a').className;
                const chat = my_chats.find(chat => chat.chat_id == chat_id);

                
                if (chat) {
                    const other_user = chat.participants.find(nbr => nbr !== my_user.id);
                    const other_user_data = user_data.find(user => user.id == other_user);

                    document.getElementById("chat-log").innerHTML = '';
                    document.getElementsByClassName("dropdown-chat-name")[0].innerText = other_user_data.username;
                    document.getElementsByClassName("chat-img-general")[0].src = other_user_data.profile.profile_picture;

                    const allChatItems = document.querySelectorAll('.match-dropdown-item');
                    allChatItems.forEach(item => {
                        item.classList.remove('inactive');
                    });
                    chatItem.classList.add('inactive');

                    const dropdownMenu = document.querySelector('.match-dropdown-menu');
                    dropdownMenu.classList.remove('show');

                    for (let i = 0; i < chat.messages.length; i++) {
                        if (chat.messages[i].sender_id == my_user.id)
                            sendMessage(my_user.username, chat.messages[i].message);
                        else
                            sendMessage(other_user_data.username, chat.messages[i].message);
                    }
                }
            }
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });


    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });



});
