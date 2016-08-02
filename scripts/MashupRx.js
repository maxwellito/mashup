/**
 * MashupRx class
 * Master class of the project, this one take
 * a valid config object then start to load the
 * content and setup listeners/observables.
 */
class MashupRx {

  /**
   * Init the master object.
   * It only create promptr to start interecting
   * with the user.
   * @param  {DOMElement} domContainer Master DOM element where everything will be set.
   */
  constructor (domContainer) {
    this.promptr = new Telepromptr(domContainer)
    this.promptr.addLine('MashupRx v0.1')
  }

  loadConfigFile (configUrl) {
    return fetch(configUrl)
      .then(res => res.json())
      .then(config => this.setConfig(config))
  }

  /**
   * Boot the instance with a config URL.
   * The method will set up the environment and
   * once ready it will start the MashupRx
   * @param  {string} configUrl Config file URL to load
   */
  boot (configUrl) {
    return this.loadConfigFile(configUrl)
      .then(() => this.loadAssets())
      .then(() => this.checkUpEnvironment())
      .then(() => this.promptr.waitForInput('Ready to go'))
      .then(() => this.start())
      .catch((e) => {
        console.info('>>', e)
        this.promptr.addError('The boot has failed. Soz\'')
      })
  }

  /**
   * Set config from a config object
   * The method is chainable
   * @param {object} config Config object to set
   * @return MashupRx       The current MashupRx instance
   */
  setConfig (config) {
    this.config = config

    if (config.info) {
      this.promptr.addLine(config.info.title, 'highlight')
      this.promptr.addLine(config.info.instructions, 'note')
    }
    else {
      this.promptr.addLine('Config ready')
    }
    return this
  }

  /**
   * Initiate an AssetBank object to load the necessary
   * assets to play the Mashup.
   * @return {Promise} Load promise
   */
  loadAssets () {
    this.promptr.addLine('Start loading assets')
    this.bank = new AssetBank(this.config.assets, this.promptr)
    return this.bank.load()
      .then(() => this.promptr.addLine('Assets loaded'))
      .catch((e) => {
        this.promptr.addError(e.message)
        this.promptr.addError('Assets load fail, please fix your config file.')
        throw new Error('Assets load fail')
      })
  }

  /**
   * Start the multiplex instance to check if the
   * environment is compatible and ready: it will
   * just check if your MIDI devices are connected.
   * @return {Promise} Ready state promise
   */
  checkUpEnvironment () {
    this.multiplex = new Multiplex(this.config.devices)

    // Recursive promise to wait all devices
    // to be connected before continuing
    var loopForDevice = (status) => {
      if (status.missingDevices) {
        return this.promptr
          .waitForInput('Please plug: ' + status.missingDevices.join(', '))
          .then(() => this.multiplex.initialise())
          .then(loopForDevice)
      }
    }

    return this.multiplex
      .initialise()
      .then(loopForDevice)
      .then(() => this.multiplex.start())
  }

  /**
   * Where all the magic begins.
   * Set up the interface and start the necesary
   * element to run the Mashup
   *
   */
  start () {
    // Detroy the promptr
    this.promptr.destroy()

    // Set up the Maestro to manage media/data streams
    this.maestro = new Maestro(this.config.workspaces, this.multiplex, this.bank)
    this
      .maestro
      .initialise()
      .loadWorkspace(0)

    // Init the players
    this.spritePlayer = new SpritePlayer(
      this.config.config.canvas.width,
      this.config.config.canvas.height,
      this.maestro.videoStream
    )

    this.audioPlayer = new AudioPlayer(
      this.maestro.audioStream,
      this.bank.audioContext
    )

    // Go fullscreen
    document.body.webkitRequestFullscreen()
  }
}
