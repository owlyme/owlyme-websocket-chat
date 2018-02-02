<template>
	<div>
		<ul class="userlist">
			<li v-for="(item, index) in clientList">{{item}}</li>
		</ul>
        <div class="owlyme-chat">
            <h2>Owlyme Chat 
				<button class="login">login</button>
				<button class="logout">logout</button>
            </h2>
            <div class="chat-window">
                <ul class="output">
                	<li v-for="(item, index) in computedMessageList">
                        <p><strong>{{item.handle}}:</strong>{{item.message}}</p>
                    </li>
                </ul>
                <div  class="feedback">{{feedback}}</div>
            </div>
            <input class="handle" type="text" placeholder="Name" v-model="user.handle" />
            <input class="message" type="text" placeholder="Message" v-model='user.message'/>
            <button class="send" @click="send">Send</button>
        </div>

    <!--<div class="privateChat">
            <div class="owlyme-chat">
                <h2> Private Chat </h2>
                <div class="chat-window">
                <ul class="output">
                	<li v-for="(item, index) in privateMessageList">{{item}}</li>
                </ul>
                <div class="feedback"></div>
            </div>
            <input class="message" type="text" placeholder="Message" />
            <button class="send">Send</button>
            </div>
        </div> -->

	</div>
</template>
<script>
	export default{
		data(){
			return{
                user: {
                    handle:'',
                    message:''
                },
				clientList : [],
				messageList: [],
				feedback: '',
			}
		},
		mounted(){
           this.onchat()            
		},
		computed:{
            computedMessageList(){
                return this.messageList
            },
		},
		methods:{
            send(){
                this.$socket.emit('chat', {
                    message: this.user.message,
                    handle: this.user.handle
                });
            },
            onchat(){
                this.$options.sockets.chat= (data)=>{
                    this.messageList.push(data)
                }  
            }
		}
	}
</script>

<style>
body{
    font-family: 'Nunito';
}

h2{
    font-size: 18px;
    padding: 10px 20px;
    color: #575ed8;
}
li{
    list-style: none;
}
.userlist, .privateChat{
    position: fixed;
    max-width: 200px;
    top: 30px;
}
.privateChat{
    display: none;
    right: 0;
    border: 1px solid #888;
    height: 200px;
    width: 200px;
}

.owlyme-chat{
    max-width: 600px;
    margin: 30px auto;
    border: 1px solid #ddd;
    box-shadow: 1px 3px 5px rgba(0,0,0,0.05);
    border-radius: 2px;
}

.chat-window{
    height: 400px;
    overflow: auto;
    background: #f9f9f9;
}

.output p{
    padding: 14px 0px;
    margin: 0 20px;
    border-bottom: 1px solid #e9e9e9;
    color: #555;
}
.feedback p{
    color: #aaa;
    padding: 14px 0px;
    margin: 0 20px;
}

.output strong{
    color: #575ed8;
}

label{
    box-sizing: border-box;
    display: block;
    padding: 10px 20px;
}

input{
    padding: 10px 20px;
    box-sizing: border-box;
    background: #eee;
    border: 0;
    display: block;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #eee;
    font-family: Nunito;
    font-size: 16px;
}

button{
    background: #575ed8;
    color: #fff;
    font-size: 18px;
    border: 0;
    padding: 12px 0;
    width: 100%;
    border-radius: 0 0 2px 2px;
}


</style>