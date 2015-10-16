function loadScript(url,callback){
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

loadScript("http://mathjs.org/js/lib/math.js",function(){
	math.config({
	  number: 'bignumber', // Default type of number: 
						   // 'number' (default), 'bignumber', or 'fraction'
	  precision: 64        // Number of significant digits for BigNumbers
	});
});

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
	v = v || "<The Tin Soldier> ";
	t=document.createElement("textarea");
	t.innerHTML = msg;
	msg=t.value;
	$("#input")[0].value = v+msg;
	$("#sayit-button").click();
}

function getCommand(x,a,b){
	if(commands[x]) commands[x](a,b);
}

mscope = {"alex":0.5,"geobits":"i","conor":true};

commands = {
	say: function(a,b){
		send(a,b);
	},
	time: function(a,b){
		send(new Date +"",b);
	},
	eval: function(a,b){
		try {
			xp=math.eval(a,mscope);
			send("`"+a+" => "+xp+"`",b);			
		} catch(e){
			send(e,b)
		}
	},
	scope: function(a,b){
		a=a.split(" ");
		mscope[a[0]] = a[1];
	},
	alex: function(a,b){
		send(String.fromCharCode(3232)+"_"+String.fromCharCode(3232),b+" @AlexA. ");
	},
	help: function(a,b){
		send("Commands: "+Object.keys(commands).join("; ")+"\nNo docs yet.",b);
	},
	status: function(a,b){
		send("I am "+_name+" and have "+_status+" minute"+(status[1]==1?"":"s")+" left to live.");
	},
	stab: function(a,b){
		send("I am a soldier, maggot! Do you think that will hurt ME?!")
	}
}

commands[String.fromCharCode(3232)+"_"+String.fromCharCode(3232)] = function(a,b){
	send("AlexA.",b);
}

_status = Infinity;
_name = "healthy";

commands["delete_self"] = function(a,b){
	name = b.replace("<The Tin Soldier> @","");
	send("\*"+name+" poisons The Tin Soldier\*\n<The Tin Soldier> No! W&ndash;Why would you do that, "+name+"?! I'm dying now. Slowly and inexorably. (Type `!status` to see how I am doing i.e. how much time I have left.)","");
	inf = _status == Infinity;
	_status = inf ? 5 : Math.floor(_status/2);
	_name = inf?"poisoned by "+name:_name+" and "+name;
	if(inf){
		setInterval(function(a){
			_status -= 1;
			if(_status<0){send("You killed me, "+a+". Now, I die.");clearInterval(intervalDude)}
		},60*1000,name);
	}
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
				getCommand(command,argument,"<The Tin Soldier> @"+username.replace(/ /g,"")+" ");
			}
		//}
	}
	recentEl = lm[3];
}

intervalDude = setInterval(checkSpoken,1);

Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}

send("Bot initiated. Type `!help` for help.");
