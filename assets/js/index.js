
var context, playList, currentTrack, bufferLoader = [], isLoading;

window.onload = init;

function init() {
  var audioFiles = [
    'animals002.mp3',
    'animals003.mp3',
    'animals004.mp3',
    'animals005.mp3',
    'animals006.mp3',
    'animals007.mp3',
    'bass.wav',
    'guitar.wav',
    'piano.wav',
    'bell.wav'
  ];
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  context = new AudioContext();

  for (var i = 0; i < audioFiles.length; i++) {
    if (!isLoading) {
      loadTrack(audioFiles[i]);
    }
  }
}

function loadTrack(track) {
  var url = 'assets/audio/'+track;
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer'; // binary format
  req.onload = function() {
    // returns PCM audio
    context.decodeAudioData(req.response, function(buffer) {
      bufferLoader.push({
        'name': track,
        'audio': buffer,
        'duration': buffer.duration
      });
    });
  };
  req.send();
}

function playSound(track, time) {
  var source = context.createBufferSource(); // create source
  source.buffer = track.audio; // sets the decoded audio buffer as source node

  // Filter
    var filter = context.createBiquadFilter();
    // Create the audio graph.
    source.connect(filter);
    filter.connect(context.destination);
    // Create and specify parameters for the low-pass filter.
    filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
    filter.frequency.value = 440; 
  //Filter Ends

  // source.connect(context.destination);
  if (time === undefined ) {
    time = 0;
  }
  // If time represents a time in the past the play will start immediately
  source.start(time);
}

function playSoundsList(playBtn) {
  // Gets the file names and convert it into array using $.map 
  playList = $.map($($(playBtn).parent()).find('input[type="checkbox"]:checked'), function(key, value) {
      return [key.nextElementSibling.innerText];
  });
  // Get the corresponding audio buffer objects for playing
  playList = bufferLoader.filter(function(bufferObj) {
    return playList.some(function(fileName) {
      return fileName === bufferObj.name;
    });
  });
  for(var i = 0; i < playList.length; i++) {
    if(i === 0) {
      // currentTime - returns a double representing an ever-increasing hardware timestamp in seconds
      playList[0].startTime = context.currentTime;
      if (playList.length > 1) {
        playList[1].startTime = playList[0].startTime + playList[0].audio.duration;
      }
    } else if(i !==0 && i < playList.length - 1) {
      playList[i + 1].startTime = playList[i].startTime + playList[i].audio.duration;
    }
    // sets the startTime
    playSound(playList[i], playList[i].startTime);
    if (i === playList.length -1) {

    }
  }
}

function playThisTrack(track, time) {
  let bufferSound = bufferLoader.find(function(obj) {
    return obj.name === track;
  });
  playSound(bufferSound, time);
}
