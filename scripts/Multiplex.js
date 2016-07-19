class Multiplex {

  constructor (deviceList) {
    this.devices      = deviceList;
    this.oPress       = null;
    this.oRelease     = null;
    this.oUpdate      = null;
  }

  initialise () {
    if (this.devices.length === 0) {
      return Promise.resolve({isReady: true});
    }

    return window
      .navigator
      .requestMIDIAccess()
      .then(function (access) {
        if('function' === typeof access.inputs || !access.inputs) {
          throw new Error('Your browser is deprecated and use an old Midi API.');
        }
        var inputs = access.inputs.values(),
            missingDevices = [];
        this.devices.map(i => i.input = null);
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          let device = this.devices.find(i => i.name === input.name);
          if (device) device.input = input.value;
        }
        let compatible = this.devices.filter(i => i.type === 'midi' && !i.input).length;
        return compatible ? {isReady: true} : {missingDevices};
      }.bind(this));
  }

  start () {
    var oPress   = null;
    var oRelease = null;
    var oUpdate  = null;
    this.devices.forEach(function (device, index) {
      if (device.type === 'midi') {
        devices.input.onmidimessage = function (e) {
          switch(e.data[0]) {
            case 128: // Release

            case 144: // Press

            case 176: // Update

          }
        }
      }
    })
  }


}

/*
  // API usage

  mltplx = new Multiplex(['MPK mini by AKAI PROFESSIONAL,LP']);
  mltplx
    .initialise()
    .then(loopForDevice)
    .then(function () {
      mltplx.start();
    })
    .catch(function (e) {
      console.error(e.msg);
    });

  function loopForDevice (status) {
    if (status.missingDevices) {
      return mltplx.initialise().then(loopForDevice);
    }
  }
*/
