const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


$(function () {

    const socket = io();
    var username = document.getElementById("yy").innerText;
    socket.emit('new user', username);
// Join chatroom
  outputMessage({text:'You Joined',username:' '})

// Message from server
    socket.on('chat message', message => {
        console.log(message);
        outputMessage(message);

        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

// Message submit
    chatForm.addEventListener('submit', e => {
        e.preventDefault();

        // Get message text
        const msg = e.target.elements.msg.value;

        // Emit message to server
        socket.emit('chat message', msg);
        outputMessage({text:msg,username:' '})
        // Clear input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    });
    socket.on('user connected', function(msg){
        outputMessage(msg)
    });

// Output message to DOM
    function outputMessage(message,socketID = '55') {
        const div = document.createElement('div')
        div.setAttribute('id',socketID)
        div.classList.add('message');
        div.innerHTML = `<p  class="meta">${message.username} <span>${new Date()}</span></p
    

  <p class="text" >
    ${message.text}
  </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    }

    var typing = false;
    var stopped = false;
    $('#chat-form').on('input',function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('typing',typing,stopped);
        typing = true
        stopped = false;

    });

    $('#chat-form').change(function(e){
        e.preventDefault();// prevents page reloading
        stopped = true
        socket.emit('typing',typing,stopped);
        typing = false

    });
    socket.on('typing',function (msg) {
        outputMessage(msg,socket.id)
    })

    socket.on('stopped',function () {
         var old = document.getElementById(socket.id)
        document.querySelector('.chat-messages').removeChild(old)

    })

})