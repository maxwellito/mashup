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
    this.devices     = deviceList
    this.press       = null
    this.release     = null
    this.update      = null
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
   * Start listening to input to stream formatted
   * data into the output streams:
   * - `press`: Streams of press events
   * - `release`: Stream of release events
   * - `update`: Stream of update events (like potentiometer?)
   */
  start () {
    var pressObs,
        releaseObs,
        updateObs

    this.press   = Rx.Observable.create(obs => pressObs   = obs),
    this.release = Rx.Observable.create(obs => releaseObs = obs),
    this.update  = Rx.Observable.create(obs => updateObs  = obs)

    var midiListener = function (e, device, index) {
      switch(e.data[0]) {
        case 128: // Release
          releaseObs.onNext([index, e.data[1], e.data[2]])
          break
        case 144: // Press
          pressObs.onNext([index, e.data[1], e.data[2]])
          break
        case 176: // Update
          updateObs.onNext([index, e.data[1], e.data[2]])
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
          pressObs && pressObs.onNext([index, e.keyCode, 0])
        })
        window.addEventListener('keyup', function (e) {
          releaseObs && releaseObs.onNext([index, e.keyCode, 0])
        })
      }
    })
  }
}
