var express = require('express');
var socket = require('socket.io');
// var chatredis = require('./redis.js');
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

// Socket setup & pass server
var io = socket(server)

let clientList=[]
let sockets = {}
io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);
    // Handle chat event

    socket.on('chat', function(data){
        console.log(data)
        io.sockets.emit('chat', data);//给所有客户端发送
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    // client login
    socket.on('login', function(data){
        // clientList.push( data );       
        //client login sucess     
        let _index = clientList.indexOf( data)
        if( _index === -1 ){
            clientList.push( data );
            socket.emit('sucess', '登录成功！');//只给自己最反馈
            socket.broadcast.emit('login', data);//除自己以外的所有客户
            console.log('made socket connection', clientList);
            sockets[data.id] = socket
        }        
    });

    // client close
    socket.on('logout', function(data){
        let _index = clientList.indexOf( data)
        if( _index >=0 ){
            clientList.splice( _index, 1 );
            socket.broadcast.emit('logout', data);
            console.log('made socket connection', clientList);
        }
    });

    socket.on('disconnect', function(data){
        console.log('disconnect')
    });

    socket.on('privatechat', function(data){
        console.log(data)
        sockets[data.id].emit('privatechat', data);//给指定的客户端发送消息
    });
});
let index = 1
// chatredis.client.zadd
// chatredis.getZSet('owl', index, index+10, "withscores").then( (res)=>{
//  console.log('zset: ' +res)
// })