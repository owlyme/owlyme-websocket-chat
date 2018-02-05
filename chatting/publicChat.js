var socket = require('socket.io');
// var chatredis = require('./redis.js');

let index = 1
// chatredis.client.zadd
// chatredis.getZSet('owl', index, index+10, "withscores").then( (res)=>{
//  console.log('zset: ' +res)
// })
module.exports = function(server){
	var io = socket(server,{
	  path: "/pubChat",
	  serveClient: false,
	  // below are engine.IO options
	  pingInterval: 10000,
	  pingTimeout: 5000,
	  cookie: false
	})

let clientList=[]
let sockets = {}

io.on('connection', (socket) => {
    // Handle chat event
    
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);//给所有客户端发送
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
    // client login
    socket.volatile.on('login', function(data){     
        //client login sucess     
        let _index = clientList.indexOf( data)
        if( _index === -1 ){
            clientList.push( data );
            socket.emit('sucess', data);//只给自己最反馈
            socket.broadcast.emit('login', data);//除自己以外的所有客户
            sockets[data.id] = socket
        }
    });
    //浏览器打开时候
    socket.on('loading', function(data){
    	// socket.emit('getUser', clientList)
        setTimeout( ()=>( socket.emit('getUser', clientList) ), 1000);//只给自己最反馈

    });

    // client close
    socket.on('logout', function(data){
        let _index = clientList.indexOf( data)
        if( _index >=0 ){
            clientList.splice( _index, 1 );
            socket.broadcast.emit('logout', data) 
        }
    });

    socket.on('disconnect', function(data){
        // console.log('disconnect')
    });

    // socket.to('/privateChat').on('privatechat', function(data){
    //     console.log(data)
    //     sockets[data.id].emit('privatechat', data);//给指定的客户端发送消息
    // });

    // console.log('socket.client',socket.handshake)
    io.clients((error, clients) => {
      if (error) throw error;
      // console.log('clients' ,clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });

});

}


