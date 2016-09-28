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

    this.multiplex.start(this.trigger.bind(this))
  }

  /**
   * Set up the output streas.
   * @return {[type]} [description]
   */
  initialise () {
    this.audioStream = new Rx.Subject();
    this.videoStream = new Rx.Subject();
    this.cmdStream   = new Rx.Subject();
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
    var eventList = []

    this
      .workspaces[index]
      .forEach(i => {
        let eventTypeId = Multiplex[i.on.toUpperCase()]
        eventList[eventTypeId] = eventList[eventTypeId] || []
        eventList[eventTypeId][i.device] = eventList[eventTypeId][i.device] || []
        eventList[eventTypeId][i.device][i.key] = i.actions
        console.log(eventTypeId, i.device, i.key, '-', i.actions)
      })

    this.eventList = eventList
  }

  /**
   * Trigger the input provided into the events/actions
   * list provided.
   * @param  {Array}  events Arrays of key config events
   * @param  {Object} input  Data output from multiplex streams
   */
  trigger (input) {
    let events, actions

    events = this.eventList[input[0]]
    if (!events) return
    actions = events[input[1]] && events[input[1]][input[2]]
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
      this.audioStream.next({
        channel: action.channel,
        media: this.bank.sounds[action.index]
      })
      break

      case 'sprite':
      this.videoStream.next({
        channel: action.channel,
        media: this.bank.images[action.index]
      })
      break

      case 'cmd':
      this.cmdStream.next({
        channel: action.channel || null,
        name: action.name,
        status: action.status
      })
      break
    }
  }
}
