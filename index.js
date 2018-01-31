var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(80, function(){
    console.log('listening for requests on port 80,');
});

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
let clientList=[]
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    // Handle chat event
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    // client login
    socket.on('login', function(data){
        clientList.push( data );
        //client login sucess     
        let _index = clientList.indexOf( data)
        if( _index >=0 ){
            clientList.push( data );
            socket.emit('sucess', '登录成功！');
        }

        socket.broadcast.emit('login', data);
    });

    // client close
    socket.on('logout', function(data){
        let _index = clientList.indexOf( data)
        if( _index >=0 ){
            clientList.splice( _index, 1 );
            socket.broadcast.emit('logout', data);
        }
    });

    // socket.on('disconnect', function(data){
    //     socket.broadcast.emit('logout', );
    // });
});
