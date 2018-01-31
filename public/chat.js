// Make connection
var socket = io.connect('192.168.0.15:80');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');
      login = document.getElementById('login');
      logout = document.getElementById('logout');

function islogin(fn){  if( handle.value.trim() ){ fn() }  }

// Emit events
//login
login.addEventListener('click', function(){
  islogin( function(){
    socket.emit('login', handle.value);
  })
});

//logout
logout.addEventListener('click', function(){
    socket.emit('logout', handle.value);
    handle.value = ''
});
//send
btn.addEventListener('click', function(){
  islogin( function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    message.value = "";
  })
});
//typing 
message.addEventListener('keypress', function(){
  islogin( function(){
    socket.emit('typing', handle.value);
  } )
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

// login
socket.on('login', function(data){
    output.innerHTML += '<p>'+ data+ ' is login </p>';
});

// logout
socket.on('logout', function(data){
    output.innerHTML += '<p>'+ data+ ' is logout </p>';
});

// logout
socket.on('sucess', function(data){
    alert(data)
});



