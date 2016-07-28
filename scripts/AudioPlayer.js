class AudioPlayer {
  constructor (obs, audioContext) {
    this.audioContext = audioContext;
    obs.subscribe(e => {
      this.play(e.media, false)
    })
  }

  play (buffer, isLoop) {
    var source = this.audioContext.createBufferSource(); // creates a sound source
    source.connect(this.audioContext.destination);       // connect the source to the context's destination (the speakers)
    source.buffer = buffer;                    // tell the source which sound to play
    source.loop = !!isLoop;
    source.start(0);                           // play the source now
    return source;
  }
}
