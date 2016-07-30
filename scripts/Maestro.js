/**
 * Maestro class
 * The maestro is link between the AssetBank
 * and the input streams. It subscribe to the
 * input streams and output data across 3
 * observable: audio, video, cmd.
 *
 * The output streams are available via
 * the following properties:
 * - `audioStream`
 * - `videoStream`
 * - `cmdStream`
 *
 */
class Maestro {

  /**
   * Init the object and start subscribing
   * to the input srreams
   * @param  {Array}     workspaces Array of workspace object
   * @param  {Multiplex} mltplxr    Multiplex object to watch
   * @param  {AssetBank} bank       AssetBank related to the multiplex
   */
  constructor (workspaces, mltplxr, bank) {
    this.workspaces = workspaces
    this.multiplex  = mltplxr
    this.bank       = bank
    this.wireInput()
  }

  /**
   * Link the input streams from the multiplex
   * to trigger events on output streams.
   */
  wireInput () {
    this.multiplex.press.subscribe(e => {
      console.log('press', e)
      this.trigger(this.pressEvt, e)
    })
    this.multiplex.release.subscribe((e) => {
      console.log('release', e)
      this.trigger(this.releaseEvt, e)
    })
    this.multiplex.update.subscribe((e) => {
      console.log('update', e)
      this.trigger(this.updateEvt, e)
    })
    console.info('Subscribers set')
  }

  /**
   * Set up the output streas.
   * @return {[type]} [description]
   */
  initialise () {
    this.audioStream = Rx.Observable.create(obs => this.audioObs = obs)
    this.videoStream = Rx.Observable.create(obs => this.videoObs = obs)
    this.cmdStream   = Rx.Observable.create(obs => this.cmdObs = obs)
    return this
  }

  /**
   * Load the workspace from the index provided
   * as parameter.
   * Chainable method.
   * @param  {number} index Workspace index
   * @return {Maestro}      Current Maestro instance
   */
  loadWorkspace (index) {
    this.pressEvt = [];
    this.releaseEvt = [];
    this.updateEvt = [];

    this
      .workspaces[index]
      .forEach(function (i) {
        let streamName = i.on + 'Evt';
        this[streamName][i.device] = this[streamName][i.device] || []
        this[streamName][i.device][i.key] = i.actions
        console.log(streamName, i.device, i.key, '-', i.actions)
      }.bind(this))
  }

  /**
   * Trigger the input provided into the events/actions
   * list provided.
   * @param  {Array}  events Arrays of key config events
   * @param  {Object} input  Data output from multiplex streams
   */
  trigger (events, input) {
    let actions = events[input[0]] && events[input[0]][input[1]]
    actions && actions.forEach(i => this.findAndBroadcast(i))
  }

  /**
   * Trigger the input provided into the event/action
   * item provided.
   * @param  {Object} action Action to trigger
   */
  findAndBroadcast (action) {
    switch (action.type) {
      case 'sound':
      this.audioObs.onNext({
        channel: action.channel,
        media: this.bank.sounds[action.index]
      })
      break

      case 'sprite':
      this.videoObs.onNext({
        channel: action.channel,
        media: this.bank.images[action.index]
      })
      break

      case 'cmd':
      // Nothing for now
      break
    }
  }
}
