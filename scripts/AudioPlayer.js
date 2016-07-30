/**
 * AudioPlayer class
 * This class subscribe to the audio stream
 * observable to dispatch the sound across the
 * different channels.
 */
class AudioPlayer {

  /**
   * Init the player and subscribe to the
   * audio stream to play
   * @param  {observable}   obs          Audio stream
   * @param  {AudioContext} audioContext App audio context
   */
  constructor (obs, audioContext) {
    this.audioContext = audioContext
    obs.subscribe(e => {
      this.play(e.media, false)
    })
  }

  /**
   * Play a buffer object on the selected
   * channel
   * @param  {AudioBuffer}  buffer Buffer to play
   * @param  {boolean}      isLoop Must the buffer be played in loop
   * @return {BufferSource}        BufferSource playing the sound
   */
  play (buffer, isLoop) {
    var source = this.audioContext.createBufferSource() // creates a sound source
    source.connect(this.audioContext.destination)       // connect the source to the context's destination (the speakers)
    source.buffer = buffer                    // tell the source which sound to play
    source.loop = !!isLoop
    source.start(0)                           // play the source now
    return source
  }
}
