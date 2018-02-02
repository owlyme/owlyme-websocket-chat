// redis 链接
const redis   = require('redis');
const client  = redis.createClient('6379', '127.0.0.1');
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const getHash = promisify(client.hget).bind(client);
const getSet = promisify(client.smembers).bind(client);
const getZSet = promisify(client.zrange).bind(client);
// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

// client.set("string key", "1212", redis.print);

// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// // client.hkeys("hash key", function (err, replies) {
// //     console.log(replies.length + " replies:");
// //     replies.forEach(function (reply, i) {
// //         console.log("    " + i + ": " + reply);
// //     });
// //     client.quit();
// // })

// client.sadd('xu', 'yuan', redis.print)

// let i = 0 




// getAsync('hash key').then( (res)=>{
// 	console.log(res)
// })

// getAsync('string key').then( (res)=>{
// 	console.log('string : ' +res)
// })

// getHash("hash key", "hashtest 1").then((res)=>{
// 	console.log('hash: ' +res)
// })

// let index = 0 

// getSet('xu').then((res)=>{
// 	console.log('set: ' +res)
// })

// while( i < 100){
// 	i++
// 	client.zadd('owl', i, 'owlyme'+i)
// }
// getZSet('owl', index, index+10, "withscores").then( (res)=>{
// 	console.log('zset: ' +res)
// })

module.exports =  {
	client,
	getZSet
}
