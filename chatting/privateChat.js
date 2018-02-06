var socket = require('socket.io');
// var chatredis = require('./redis.js');

let index = 1
// chatredis.client.zadd
// chatredis.getZSet('owl', index, index+10, "withscores").then( (res)=>{
//  console.log('zset: ' +res)
// })

module.exports = function(server){
var io = socket(server,{
  path: "/privateChat",
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
})
let clientList=[]
let sockets = {}
let socketlist = []

io.on('connection', (socket) => {
    socket.on('chat', function(data){
        console.log(data)
        socket.to(data.remoteSocketId).emit('chat', data);//给所有客户端发送
        socket.broadcast.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
      console.log(data)
      socket.broadcast.emit('typing', data);
    });


    socket.on('privatechat', function(data){
      console.log(data)
        sockets[data.id].emit('privatechat', data);//给指定的客户端发送消息
    });

    // console.log('socket.client',socket.handshake)
    io.clients((error, clients) => {
      if (error) throw error;
       console.log('clients' ,clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
});

}
