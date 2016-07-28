class Maestro {
  constructor (workspaces, mltplxr, bank) {
    this.workspaces = workspaces
    this.multiplex = mltplxr
    this.bank = bank
    this.wireInput()
  }

  wireInput () {
    this.multiplex.press.subscribe(e => {
      console.log('press', e)
      this.trigger(this.pressEvt, e)

    })
    this.multiplex.release.subscribe((e) => {
      console.log('release', e)
      // this.releaseEvt[e[0]][e[1]].forEach(i => this.findAndBroadcast(i))
      this.trigger(this.releaseEvt, e)
    })
    this.multiplex.update.subscribe((e) => {
      console.log('update', e)
      // this.updateEvt[e[0]][e[1]].forEach(i => this.findAndBroadcast(i))
      this.trigger(this.updateEvt, e)
    })
    console.info('Subscribers set')
  }

  initialise () {
    this.audioStream = Rx.Observable.create(obs => this.audioObs = obs)
    this.videoStream = Rx.Observable.create(obs => this.videoObs = obs)
    this.cmdStream   = Rx.Observable.create(obs => this.cmdObs = obs)
    return this
  }

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

  trigger (events, input) {
    let actions = events[input[0]] && events[input[0]][input[1]]
    actions && actions.forEach(i => this.findAndBroadcast(i))
  }

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

// .subscribe(function(event) {
//   console.log(event);
// }, function (err) {
//   console.error(err)
// });
