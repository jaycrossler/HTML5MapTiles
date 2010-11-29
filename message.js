/*All code copyright 2010 by John Graham unless otherwise attributed*/
//Adds of message_single by Jay Crossler - CC BY/3.0 license

var Message = { //object to create messages (using alert in a game loop will crash your browser)
	message: 0, //hold element where messages will be added
	message_single: 0,
	init: function(){
		Message.message = document.getElementById('message');
		Message.message_single = document.getElementById('message_single');
	},
	addMessage: function(msg){ //add new message
		if(Message.message){
			msg = '- '+msg+'<br />';
			Message.message.innerHTML += msg;
		}
	},
	newMessage: function(msg){ //add new message
		if(Message.message){
			msg = '- '+msg+'<br />';
			Message.message.innerHTML = msg;
		}
	},
	newMessageSingle: function(msg){ //add new message
		if(Message.message_single){
			msg = '- '+msg;
			Message.message_single.innerHTML = msg;
		}
	}
};

var FPS = {
	fps: 0, //hold element to display fps
	fps_count: 0, //hold frame count
	fps_timer: 0, //timer for FPS update (2 sec)
	init: function(){
		FPS.fps = document.getElementById('fps');
		FPS.fps_timer = setInterval(FPS.updateFPS, 2000);
	},
	updateFPS: function(){ //add new message
		if(FPS.fps){
			FPS.fps.innerHTML = (FPS.fps_count / 2) + 'fps';
		}
		FPS.fps_count = 0;
	}
};



Message.init();
FPS.init();