

var Sound=function(source,level){

	var isLoaded=false;

	//Creating audio context
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	window.ac = new AudioContext();


	//Creating Destination node
	window.destinationNode=window.ac.destination;
	
	// Fetching and decoding audio from url
	var bufferedSound;
	var ajax=new XMLHttpRequest();
	ajax.open('GET',source,true);
	ajax.responseType='arraybuffer';
	ajax.onload=function(){
		ac.decodeAudioData(ajax.response,function(buffer){
			bufferedSound=buffer;
			isLoaded=true;
		});

	};
	ajax.send();

	this.play=function(level,delay){

		delay=delay||0;
		level=(level/100)||1;
		
		//Creating source node, connecting it to destination and start play
		if(isLoaded){

			//Creating Source node
			var sourceNode=ac.createBufferSource();
			sourceNode.buffer=bufferedSound;

			//Creating volume node
			var volumeNode=ac.createGain();
			volumeNode.gain.value=level;


			//Connecting nodes Source >> Volume >> Destination
			sourceNode.connect(volumeNode);
			volumeNode.connect(destinationNode);

			sourceNode.start(delay);
		}

	};

};
