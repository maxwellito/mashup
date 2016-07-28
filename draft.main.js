// Girls just wanna have fun
var theMashup;

fetch('model.json')
  .then(res => res.json())
  .then(config => {
    window.laConfig = config;

    var xx = new Multiplex(laConfig.devices);
    window.xx = xx;
    xx.initialise().then(function (e) {
      console.log('success', e);
      xx.start();
    }, function (err) {
      console.error(err);
    });

    theMashup = new MashupRx(config);
    return theMashup.bank.load();
  })
  .then(() => {
    console.log('LOADED');
    go();
  });


  var sp;

  function go() {
    sp = new SpritePlayer(320, 180)
    document.body.appendChild(sp.el)
    sp.setSprite(theMashup.bank.images[0])
    sp.input = 0;
    sp.play()
  }



document.addEventListener('dblclick', function () {
  document.body.webkitRequestFullscreen();
})


if(!window.navigator || 'function' !== typeof window.navigator.requestMIDIAccess) {
  console.error('No MIDI senor Griffin, noooooo....');
  throw 'No Web MIDI support';
}

var kiki;

window.navigator
  .requestMIDIAccess()
  .then(function(access) {
    if('function' === typeof access.inputs) {
      // deprecated
      devices = access.inputs();
      console.error('Update your Chrome version!');
    }
    else {
      if (access.inputs && access.inputs.size > 0) {
        var inputs = access.inputs.values(),
        input = null;

        var mapping = [
          67,
          65,
          71,
          69,
          60,
          62
        ];

        var keeys = ['iStart', 'iDelay', 'iEnd'];


        // iterate through the devices
        for (input = inputs.next(); input && !input.done; input = inputs.next()) {
          console.log('One device added', input);
          input.value.addEventListener('midimessage', function (e) {
            /**
             * e.data is an array
             * e.data[0] = on (144) / off (128) / detune (224)
             * e.data[1] = midi note
             * e.data[2] = velocity || detune
             */
            var data = e.data;
            console.log(data);

            // if (data[0] === 176) {
            //   sp[keeys[data[1] - 1]] = data[2] / 128;
            // }

            if (data[0] !== 144) return;
            if (data[1] === 48) {
              if (kiki) {
                kiki.stop()
                kiki = null;
                sp.inputOn = false;
              }
              else {
                kiki = playSound(theMashup.bank.sounds[6], true);
                sp.inputOn = true;
              }
              return;
            }
            playSound(theMashup.bank.sounds[mapping.indexOf(data[1])]);
            sp.input = Math.floor(data[2]/4);
            sp.setSprite(theMashup.bank.images[mapping.indexOf(data[1])]);
            sp.play();
            console.log(sp.input);


          });

        }
      } else {
        console.error('No devices detected!');
      }

    }
  });


function playSound(buffer, isLoop) {
  var context = theMashup.bank.audioContext;
  var source = context.createBufferSource(); // creates a sound source
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.buffer = buffer;                    // tell the source which sound to play
  source.loop = !!isLoop;
  source.start(0);                           // play the source now
  return source;                                       // note: on older systems, may have to use deprecated noteOn(time);
}
