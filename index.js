var express = require('express');
var socket = require('socket.io');
var publicChat = require('./chatting/publicChat.js');
var privateChat = require('./chatting/privateChat.js')

// App setup
var app = express();
// var server = app.listen(80, '192.168.0.15',function(){
//     console.log('listening for requests on port 80,');
// });
var server = app.listen(4000, '127.0.0.1',function(){
    console.log('listening for requests on port 4000,');
});

// Static files
app.use(express.static('public'));
// app.use(express.static('dist'));

//public chating
publicChat(server)

//private chating
privateChat(server)
