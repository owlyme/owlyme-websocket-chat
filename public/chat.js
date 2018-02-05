$(document).ready(function(){



(function(){
  var l=  console.log
  /*
  args = {
    message : $('#message'),
    handle : //获取用户的登录名
    sendBtn : $('#send'),
    output : $('#output'),
    feedback : $('#feedback'),
    login : $('#login'),
    logout : $('#logout'),
    userlist : $('#userlist'),
    privateChat : $('#privateChat'),
    clientList  : [];
  }
  */

  var Chat = function(socket, args){
    return new Chat.fn(socket,args)
  }

  Chat.fn = function(socket,args){
    this.socket   = socket;
    this.remoteSocketId = args.remoteSocketId;
    this.message  = args.message;
    this.handle   = args.handle;
    this.sendBtn  = args.sendBtn;
    this.output   = args.output;
    this.feedback = args.feedback;
    this.login    = args.login;
    this.logout   = args.logout;
    this.userlist = args.userlist;
    this.privateChat = args.privateChat;
    this.timeout  = args.timeout || 2000;

    this.init();
  }

  Chat.fn.prototype = {
    hello: 'hello world',
    clientList: [],
    init : function(){
        this.sendMsg();
        this.receiveMsg();
        this.typing();
        this.renderClientList();
    },
    sendMsg: function(){
        var self = this;        
        self.sendBtn.on('click', function(){
          if( !self.beforeSend() ) return; //条件不满足需发送信息
          if( !self.remoteSocketId ){//
            self.socket.emit('chat', {
                message: self.message.val(),
                handle: self.handle,
            });
          }else if(self.remoteSocketId){//私聊功能
            l(self.socket.id)
            self.socket.emit('chat', {
                message: self.message.val(),
                handle: self.handle,
                socketId : self.socket.id,
                remoteSocketId: self.remoteSocketId
            });
          }
          self.output.append('<p><strong>' + self.handle + ': </strong>' + self.message.val() + '</p>' )
          self.message.val("");
        })
    },
    receiveMsg: function(){
        var self = this;
        self.socket.on('chat', function(data){
          l(data)
            if( self.privateChat) {//私聊功能
              self.privateChat.show();
              self.remoteSocketId = data.localSocketId
            }
            self.feedback.empty();
            self.output.append('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>' );
        });
    },
    typing: function(){
        var self = this;
        self.message.on('keypress', function(){
            self.socket.emit('typing', self.handle);
        });
        self.socket.on('typing', function(data){
            self.feedback.html('<p><em>' + data + ' is typing a message...</em></p>');
        });
    },
    beforeSend: function (){
      var self = this;
      var validate = true ;
      validate = !self.handle ? (function (){ l("名字为空"); return false })()
                  : !self.message.val() ? (function (){ l("消息为空"); return false })()
                  : true ;
      return validate
    },
    renderClientList: function(){
      var self = this;
      if( !self.userlist ) return;
      //浏览器打开时候
      self.socket.emit('loading')
        // var timer = setTimeout( function(){self.socket.emit('loading')}, 5);//异步的操作---------------------
        self.socket.on('getUser', function(data){
        // clearTimeout( timer )
        self.clientList=data.slice()
        addUser()
      })

      self.socket.on('login', function(data){
          self.output.append( '<p>'+ data.handle+ ' is login </p>');
          self.clientList.push( data )
          addUser()
      })
      function  addUser(){
        // self.userlist.empty();
          self.clientList.forEach( function(item, index){
            self.userlist.append('<p><em>' +item.handle+ '</p>');
          })
      }
    },
    usersDdclick(){
      var self = this;
      // self.userlist
    }

  }

  window.chat = Chat

})();

// var cur = Date.now()
//  while( Date.now()- cur < 5000){}

var socket = io('127.0.0.1:4000',{ path: "/pubChat" });

var PublicChat = chat(socket, {
          timeout : 5000,  
          message : $('#message'),
          // handle : data.handle ,//获取用户的登录名
          sendBtn : $('#send'),
          output : $('#output'),
          feedback : $('#feedback'),
          login : $('#login'),
          logout : $('#logout'),
          userlist : $('#userlist'),
          privateChat : $('#privateChat')
   })


var socket1 = io('127.0.0.1:4000',{ path: "/privateChat" });
var PrivateChat = chat(socket1, {
          message : $('#message1'),
          handle : 'xy',//获取用户的登录名
          sendBtn : $('#send1'),
          output : $('#output1'),
          feedback : $('#feedback1'),
          privateChat : $('#privateChat')
        })

var l=  console.log,
    output = $('#output'),
    userlist = $('#userlist');

$('#login').on('click', function(){
    var name  = 'xy'+Math.random()
    socket.emit('login', {handle: name, id: socket.id});
});
// logout sucess
socket.on('sucess', function(data){
    l(data);
    PublicChat.handle  = data.handle
});

PublicChat.userlist.on('dblclick', 'p', addPrivate)

function addPrivate(e){
    let name = $(this).text();
    let _index = $(this).index();
    l(name);
    PrivateChat.privateChat.show();
    idIndex = PublicChat.clientList[_index].id;
    PrivateChat.remoteSocketId = idIndex
}



// var socket = io.connect('192.168.0.15:80');

// var socket = io().connect('127.0.0.1:4000');


// var socket = io('127.0.0.1:4000',{
//   path: "/chat"
// })
// // console.log(socket)
// // Query DOM
// var message = $('#message'),
//     handle = $('#handle'),
//     btn = $('#send'),
//     output = $('#output'),
//     feedback = $('#feedback'),
//     login = $('#login'),
//     logout = $('#logout'),
//     userlist = $('#userlist'),
//     privateChat = $('#privateChat'),
//     clientList  = [];
// var l=  console.log
// function islogin(fn){  if( handle.val().trim() ){ fn() }  }

// function renderClientList(clientList, userlist){
//   userlist.empty();
//   clientList.forEach( function(item, index){
//     userlist.append('<p><em>' +item.handle+ '</p>');
//   })
// }


// // Emit events
// //login
// login.on('click', function(){
//   socket.open();
//   islogin( function(){
//     socket.emit('login', {handle: handle.val(), id: socket.id} );
//   })
// });

// //logout
// logout.on('click', function(){
//     socket.emit('logout', handle.val());
//     handle.val('')
// });
// //send
// btn.on('click', function(){
//   islogin( function(){
//     socket.emit('chat', {
//         message: message.val(),
//         handle: handle.val()
//     });
//     message.val("");
//   })
// });
// //typing 
// message.on('keypress', function(){
//   islogin( function(){
//     socket.emit('typing', handle.val());
//   } )
// })

// // Listen for events
// socket.on('chat', function(data){
//     feedback.empty();
//     output.append('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>' );
// });

// socket.on('typing', function(data){
//     feedback.append('<p><em>' + data + ' is typing a message...</em></p>');
// });

// // login
// socket.on('login', function(data){
//     output.append( '<p>'+ data.handle+ ' is login </p>');
//     clientList.push( data )
//     renderClientList(clientList, userlist)
// });

// // logout
// socket.on('logout', function(data){
//     output.append( '<p>'+ data+ ' is logout </p>');
//     let _index = clientList.indexOf( data)
//         if( _index >=0 ){
//             clientList.splice( _index, 1 );
//         }
//     renderClientList(clientList, userlist)
// });

// // logout sucess
// socket.on('sucess', function(data){
//     alert(data)
// });

// // private chatting

// var message1 = $('#message1'),
//     btn1 = $('#send1'),
//     output1 = $('#output1'),
//     feedback1 = $('#feedback1'),   
//     privateChat = $('#privateChat'),
//     idIndex= '';

// function addPrivate(e){
//   let name = $(this).text()
//   let _index = $(this).index()
//   l(name,)
//   privateChat.show();
//   idIndex = clientList[_index].id
// }

// userlist.on('dblclick','p',addPrivate)

// btn1.on('click',function(){
//   l(idIndex)
//   socket.emit('privatechat', {
//         message: message1.val(),
//         handle: handle.val(),
//         id : idIndex
//     });
//   // socket.emit('privatechat', {
//   //       message: message1.val(),
//   //       handle: handle.val(),
//   //       socketid : socket.id
//   //   });
// });

// socket.on('privatechat', function(data){
//    l(data)
//     privateChat.show();
//     output1.append('<p><strong>' + data.handle + ': </strong>' + data.message + '</p>')
// });

// // window.location.reload();


})
