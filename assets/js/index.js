
var context, playList, currentTrack;

function playSoundsList(playBtn) {
  playList = $($(playBtn).parent()).find('input[type="checkbox"]:checked').map(function(x, obj) { 
    return obj.nextElementSibling.innerText;
  });
}

function loadTrack(track) {
  var req = new XMLHttpRequest();
  req.url = 'assets/audio/'+track;
  req.responseType = 'arraybuffer';
  req.onload(function(buffer) {
    currentTrack = context.decodeAudioData(buffer);
  });
  req.send();
}

function playSound(track, time) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  context = new AudioContext();

  var source = context.createBufferSource(); // create source
  source.buffer = currentTrack; // tell the source which track should be played

  source.connent(context.destination);

  source.start(time);
}
