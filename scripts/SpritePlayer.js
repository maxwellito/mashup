/**
 * SpritePlayer class
 * Create a canvas to my used for sprite
 * plays, controls and effetcs.
 * The player take the video stream as input
 * to display content, and cmdSteamd to apply
 * effects.
 */
class SpritePlayer {

  /**
   * Set up the canvas and subscribe to the
   * video stream.
   * @param  {number}     width   Canvas width
   * @param  {number}     height  Canvas height
   * @param  {Observable} obs     Video stream observable
   */
  constructor (width, height, obs) {
    this.createCanvas(width, height)
    this.browserTimepoint = null
    this.media = null
    this.mediaIndex = 0
    this.filters = []

    this.iStart = 0
    this.iDelay = 0
    this.iEnd   = 0
    this.input = 44

    this.runnerBinded = this.frameRunner.bind(this)
    obs
      .filter(e => ~SpritePlayer.CMD_LIST.indexOf(e.cmd))
      .subscribe(this.router.bind(this))
  }

  router (e) {
    switch (e.cmd) {
    case 'sprite':
      this.onloop = e.loop
      this.setSprite(e.media)
      this.play()
      break

    case 'filter_start':
      this.filters.push({
        filter: spriteFilters[e.name],
        input: () => Math.floor(Math.random() * 64)
      })
      break

    case 'filter_end':
      for (let i = this.filters.length - 1; i >= 0; i--) {
        if (this.filters[i].filter === spriteFilters[e.name]) {
          this.filters.splice(i, 1)
          return
        }
      }
      break
    }
  }

  processFilter () {
    this.filters.forEach(f => {
      f.filter(this.ctx, f.input())
    })
  }

  /**
   * Set a new sprite from a sprite object.
   * It replace the current canvas to the
   * new one and reset timers.
   * @param {object} sprite Sprite object to set
   */
  setSprite (sprite) {
    this.media = sprite
    this.mediaIndex = 0
    this.inputOn = true
    this.input = (((this.input || 0) + 4) % 128)
    // this.input = Math.floor(Math.random() * 12)
    this.iStart = .221233
    this.iEnd   = .6
    this.iDelay = Math.random()
    this.mediaFramerate = 1000 / sprite.fps
  }

  /**
   * Start the player
   * @param  {number} from Frame index to start with
   */
  play (from = 0) {
    this.browserTimepoint = Date.now() - from
    this.mediaIndex = -1
    this.frameRunner()
  }

  /**
   * Stop the player by cancelling the animation frame
   */
  pause () {
    cancelAnimationFrame(this.loop)
  }

  // Engine methods
  /**
   * Set the display canvas
   * @param  {number}     width   Canvas width
   * @param  {number}     height  Canvas height
   */
  createCanvas (width, height) {
    var canvas = document.createElement('canvas')
    this.width  = canvas.width  = width
    this.height = canvas.height = height
    this.ctx = canvas.getContext('2d')

    this.el = canvas
    document.body.appendChild(this.el)
  }

  /**
   * Display the picture from the index
   * provided as parameter
   * @param  {number} index Frame number to show
   */
  showPicture (index) {
    if (this.mediaIndex === index) {
      return
    }

    var fx = Math.floor(index % this.media.columns) * this.width,
        fy = Math.floor(index / this.media.columns) * this.height

    this.ctx.clearRect(0, 0, this.width, this.height) // clear frame
    this.ctx.drawImage(this.media.data,
                       fx, fy, this.width, this.height,
                        0,  0, this.width, this.height)

    this.processFilter()
    this.mediaIndex = index
  }

  /**
   * Enter frame binder apply between two
   * frame to show the next picture
   */
  frameRunner () {
    var now = Date.now() - this.browserTimepoint
    var frameIndex = Math.floor(now / this.mediaFramerate)
    if (!this.onloop && frameIndex >= this.media.length) {
      // ABORT
      this.pause()
      return
    }
    frameIndex %= this.media.length
    this.showPicture(frameIndex)
    this.loop = requestAnimationFrame(this.runnerBinded)
  }
}

SpritePlayer.CMD_LIST = [
  'sprite',
  'filter_start',
  'filter_end'
]
