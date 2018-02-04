// Make connection
// var socket = io.connect('192.168.0.15:80');

// var socket = io().connect('127.0.0.1:4000');
var socket = io('127.0.0.1:4000',{
  path: "/chat"
})
// console.log(socket)
// Query DOM
var message = $('#message'),
    handle = $('#handle'),
    btn = $('#send'),
    output = $('#output'),
    feedback = $('#feedback'),
    login = $('#login'),
    logout = $('#logout'),
    userlist = $('#userlist'),
    privateChat = $('#privateChat'),
    clientList  = [];
var l=  console.log
function islogin(fn){  if( handle.val().trim() ){ fn() }  }

function renderClientList(clientList, userlist){
  userlist.empty();
  clientList.forEach( function(item, index){
    userlist.append('<p><em>' +item.handle+ '</p>');
  })
}


// Emit events
//login
login.on('click', function(){
  socket.open();
  islogin( function(){
    socket.emit('login', {handle: handle.val(), id: socket.id} );
  })
});

//logout
logout.on('click', function(){
    socket.emit('logout', handle.val());
    handle.val('')
});
//send
btn.on('click', function(){
  islogin( function(){
    socket.emit('chat', {
        message: message.val(),
        handle: handle.val()
    });
    message.val("");
  })
});
//typing 
message.on('keypress', function(){
  islogin( function(){
    socket.emit('typing', handle.val());
  } )
})

// Listen for events
socket.on('chat', function(data){
    feedback.empty();
    output.append('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>' );
});

socket.on('typing', function(data){
    feedback.append('<p><em>' + data + ' is typing a message...</em></p>');
});

// login
socket.on('login', function(data){
    output.append( '<p>'+ data.handle+ ' is login </p>');
    clientList.push( data )
    renderClientList(clientList, userlist)
});

// logout
socket.on('logout', function(data){
    output.append( '<p>'+ data+ ' is logout </p>');
    let _index = clientList.indexOf( data)
        if( _index >=0 ){
            clientList.splice( _index, 1 );
        }
    renderClientList(clientList, userlist)
});

// logout sucess
socket.on('sucess', function(data){
    alert(data)
});

// private chatting

var message1 = $('#message1'),
    btn1 = $('#send1'),
    output1 = $('#output1'),
    feedback1 = $('#feedback1'),   
    privateChat = $('#privateChat'),
    idIndex= '';

function addPrivate(e){
  let name = $(this).text()
  let _index = $(this).index()
  l(name,)
  privateChat.show();
  idIndex = clientList[_index].id
}

userlist.on('dblclick','p',addPrivate)

btn1.on('click',function(){
  l(idIndex)
  socket.emit('privatechat', {
        message: message1.val(),
        handle: handle.val(),
        id : idIndex
    });
  // socket.emit('privatechat', {
  //       message: message1.val(),
  //       handle: handle.val(),
  //       socketid : socket.id
  //   });
});

socket.on('privatechat', function(data){
   l(data)
    privateChat.show();
    output1.append('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>')
});

// window.location.reload();



