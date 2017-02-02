
var context, playList, currentTrack, bufferLoader = [], isLoading;

window.onload = init;

function init() {
  var audioFiles = [
    'animals002.mp3',
    'animals003.mp3',
    'animals004.mp3',
    'animals005.mp3',
    'animals006.mp3',
    'animals007.mp3'
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
  source.connect(context.destination);
  if (time === undefined ) {
    time = 0;
  }
  source.start(time);
}

function playSoundsList(playBtn) {
  // Gets the file names and convert it into array using $.map 
  playList = $.map($($(playBtn).parent()).find('input[type="checkbox"]:checked').map(function(x, obj) {
      return obj.nextElementSibling.innerText;
    }), function(key, value) {
      return [key];
  });
  // Get the corresponding audio buffer objects for playing
  playList = bufferLoader.filter(function(bufferObj) {
    return playList.some(function(fileName) {
      return fileName === bufferObj.name;
    });
  });
  for(var i=0; i<playList.length - 1; i++) {
    if(i === 0) {
      playList[0].startTime = 0
    }
    playSound(playList[i], playList[i].startTime);
    // sets the startTime
    playList[i + 1].startTime = playList[i].startTime + playList[i].audio.duration;
  }
}

function playThisTrack(track, time) {
  let bufferSound = bufferLoader.filter(function(obj) {
    return obj.name === track;
  });
  playSound(bufferSound[0], time);
}
