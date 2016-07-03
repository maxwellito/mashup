var context = new AudioContext(),
    bank = {};

function loadSound (url) {
  fetch(url)
    .then(response => response.arrayBuffer())
    .then(function (data) {
      context.decodeAudioData(data, function(buffer) {
        bank[url] = buffer;
      }, function () {});
    })
}


function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.buffer = buffer;                    // tell the source which sound to play
  source.loop = true;
  source.start(0);                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}

loadSound('assets/wayf.mp3');
loadSound('assets/01_because.wav');
loadSound('assets/02_we.wav');
loadSound('assets/03_are.wav');
loadSound('assets/04_yourFriends.wav');

var map = {
  q: 'assets/01_because.wav',
  w: 'assets/02_we.wav',
  e: 'assets/03_are.wav',
  r: 'assets/04_yourFriends.wav'
};

document.addEventListener('keydown', function (e) {
  var k = map[e.key];
  if (!k) {
    return;
  }
  playSound(bank[k]);
});
