/**
 * AssetBank class
 * This class is in charge of loading assets: sprites
 * and sounds. In a format ready to be consumed.
 *
 * @param {object} assetsList Assets to load from the main config
 */
class AssetBank {

  /**
   * Init the object and setup the session AudioContext
   * @param  {Object} assetsList List of assets to load
   */
  constructor (assetsList) {
    this.list = assetsList
    this.audioContext = new AudioContext()
    this.sounds = []
    this.images = []
  }

  /**
   * Start to load all the required assets from the
   * list provided to the constructor
   *
   * @return {promise} Is the load a success?
   */
  load () {
    var soundsLoad = this.list.sounds.map(this.loadSound.bind(this))
    var imagesLoad = this.list.sprites.map(this.loadImage.bind(this))
    return Promise.all(soundsLoad.concat(imagesLoad))
  }

  /**
   * Load a sound from the provided URL
   * @param  {string} url   Sound URL to load
   * @param  {number} index Index of the sound
   * @return {promise}      Promise of the sound load
   */
  loadSound (url, index) {
    return fetch(url)
      .then(response => {
        if (response.status >= 300 || response.status < 200) {
          throw new Error('Cannot load: ' + url + ' [' + response.status + ']')
        }
        return response.arrayBuffer()
      })
      .then(data => {
        this.audioContext.decodeAudioData(data, buffer => {
          this.sounds[index] = buffer
        })
      })
  }

  /**
   * Load a sprite from the provided URL
   * @param  {object} imgObj Image config to load
   * @param  {number} index  Index of the sound
   * @return {promise}       Promise of the sound load
   */
  loadImage (imgObj, index) {
    return new Promise(function (resolve, reject) {
      var img = new Image()
      img.onload = resolve
      img.onerror = reject
      img.src = imgObj.url

      imgObj.data = img
      this.images[index] = imgObj
    }.bind(this))
    .catch(() => {throw new Error('Cannot load: ' + imgObj.url)})
  }
}
