/**
 * Multiplex class
 * Takes a list of devices (MIDI or simple keyboard)
 * and check their availability.
 */
class Multiplex {

  /**
   * Just keep the device list and set up properties
   * to optimise V8 engine.
   * @param  {Array} deviceList Device list from the config
   */
  constructor (deviceList) {
    this.devices = deviceList
    this.outputObservable = Rx.Observable.create(observable => {

      var midiListener = function (e, device, index) {
        console.log('::', e.data[0], e.data[1], e.data[2])
        switch(e.data[0]) {
          case 128: // Release
            observable.next([Multiplex.RELEASE, index, e.data[1], e.data[2]])
            break
          case 144: // Press
            observable.next([Multiplex.PRESS, index, e.data[1], e.data[2]])
            break
          case 176: // Update
            observable.next([Multiplex.KNOB, index, e.data[1], e.data[2]])
            break
        }
      }

      this.devices.forEach(function (device, index) {
        if (device.type === 'midi') {
          device.input.onmidimessage = function (e) {
            midiListener(e, device, index)
          }
        }
        else if (device.type === 'keyboard') {
          window.addEventListener('keydown', function (e) {
            observable.next([Multiplex.PRESS, index, e.keyCode, 0])
          })
          window.addEventListener('keyup', function (e) {
            observable.next([Multiplex.RELEASE, index, e.keyCode, 0])
          })
        }
      })
    })
  }

  /**
   * Check the list of connected devices and return a
   * promise which inform is the environment is ready
   * or which devices are missing. To try again in case
   * of missing devices, the method has to be called again.
   * @return {Promise} State promise
   */
  initialise () {
    if (this.devices.length === 0) {
      return Promise.resolve({isReady: true})
    }

    return window
      .navigator
      .requestMIDIAccess()
      .then((access) => {
        if('function' === typeof access.inputs || !access.inputs) {
          throw new Error('Your browser is deprecated and use an old Midi API.')
        }
        var inputs = Array.from(access.inputs.values()),
            connectedDevicesName = inputs.map(i => i.name),
            missingDevices

        // Let's assume, there's no device doublons.
        missingDevices = this.devices.filter(device => {
          if (device.type === 'midi') {
            let index = connectedDevicesName.indexOf(device.name)
            if (!~index) {
              return true
            }
            device.input = inputs[index]
          }
        })
        missingDevices = missingDevices.map(i => i.name)
        console.log('missing devices', missingDevices)
        console.log('connected devices', connectedDevicesName)
        return missingDevices.length ? {missingDevices} : {isReady: true, devices: connectedDevicesName}
      })
  }

  /**
   * Start the observable to listen on input
   * to stream formatted data
   * [
   * 	int: event type ID,
   * 	int: device index,
   * 	int: note,
   * 	int: velocity
   * ]
   */
  start (subscriber) {
    this.outputObservable.subscribe(subscriber)
  }
}

Multiplex.PRESS   = 0x00
Multiplex.RELEASE = 0x01
Multiplex.KNOB    = 0x02
