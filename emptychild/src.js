// # from jQuery import src.js::1

function obtainLastMessage(){
	message  = $("div.monologue:last .content");
	messages = [];
	for(var i=0;i<message.length;i++){
		messages.push(message[i].innerHTML)
	}
	username = $("div.monologue:last .username")[0].innerHTML;
	return [username,"said",messages,$("div.monologue:last")]
}

function send(msg,v){
	v = v || "<The Empty Child> ";
	t=document.createElement("textarea");
	t.innerHTML = msg;
	msg=t.value;
	$("#input")[0].value = v+msg;
	$("#sayit-button").click();
}

function getCommand(x,a,b,c){
	if(commands[x]) commands[x](a,b,c);
}

function Cell(){
  this.type = null;
}

function Board(){
  this.width = 50;
  this.height = 50;
  this.b = [];
  for(var i=0;i<this.height;i++){
    this.b[i] = [];
    for(var j=0;j<this.width;j++){
      this.b[i][j] = new Cell();
    }
  }
}

function Person(){
  this.health = 100;
}

people = {};

commands = {
  join: function(a,b,user){
    people[user] = new Person(user);
  }
}

commands[String.fromCharCode(3232)+"_"+String.fromCharCode(3232)] = function(a,b){
	send("AlexA.",b);
}

intervalDude = setInterval(checkSpoken,1);

send("The Empty Child has come! Type `!join` to join the fray!");

function kill(){
  send("The Empty Child is leaving... for now!");
}

recentEl = null;

function checkSpoken(){
	if(typeof window.status=="string"){
		window.status = window.status.split(",");
	}
	lm = obtainLastMessage();
	if(lm[3]!=recentEl){
		content = lm[2];
		x = content.length - 1;
		content[x]=content[x].replace(/<a.+?><span.+?>(.+?)<\/span><\/a>/,"[tag:$1]");
		window.mostRecentMessage = lm;
		//for(var x=0;x<content.length;x++){
			if(content[x].search(/^!/g+1)){ // a command may be present!
				mid = content[x].indexOf(" ");
				mid = mid+1?mid:mid.length;
				command  = content[x].slice(1,mid);
				argument = content[x].slice(mid,x.length).trim();
				getCommand(command,argument,"<The Empty Child> @"+username.replace(/ /g,"")+" ",lm[0]);
			}
		//}
	}
	recentEl = lm[3];
}

intervalDude = setInterval(checkSpoken,1);
