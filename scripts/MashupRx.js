/**
 * MashupRx class
 * Master class of the project, this one take
 * a valid config object then start to load the
 * content and setup listeners/observables.
 *
 * @param {object} config Config of the session
 */
class MashupRx {
  constructor (domContainer) {
    this.promptr = new Telepromptr(domContainer)
    this.promptr.addLine('MashupRx v0.1')
  }

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

  loadConfigFile (configUrl) {
    return fetch('model.json')
      .then(res => res.json())
      .then(config => this.setConfig(config))
  }

  setConfig (config) {
    this.config = config
    this.promptr.addLine('Config ready')
    return this
  }

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

  checkUpEnvironment () {
    this.multiplex = new Multiplex(this.config.devices)
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

  start () {


    this.promptr.destroy()
    this.maestro = new Maestro(this.config.workspaces, this.multiplex, this.bank)
    this
      .maestro
      .initialise()
      .loadWorkspace(0)

    this.spritePlayer = new SpritePlayer(
      this.config.config.canvas.width,
      this.config.config.canvas.height,
      this.maestro.videoStream
    )

    this.audioPlayer = new AudioPlayer(
      this.maestro.audioStream,
      this.bank.audioContext
    )


    document.body.webkitRequestFullscreen()
  }
}
