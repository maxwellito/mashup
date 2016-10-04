/**
 * Maestro class
 * The maestro is link between the AssetBank
 * and the input streams. It subscribe to the
 * input streams and output data via only one
 * output stream.
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

    this.loadWorkspace(0)
    this.multiplex.start(this.trigger.bind(this))
    this.output = new Rx.Subject()
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

        i.actions.forEach(a => {
          if (a.cmd === 'sound') {
            a.media = this.bank.sounds[a.index]
          }
          else if (a.cmd === 'sprite') {
            a.media = this.bank.images[a.index]
          }
        })
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
    actions && actions.forEach(i => this.output.next(i))
  }
}
