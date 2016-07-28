class Telepromptr {
  constructor (domContainer) {
    this.el = document.createElement('div')
    this.el.classList.add('telepromptr')
    domContainer.appendChild(this.el)

    this.inputStack = []
    this.enterListener = (e) => {
      if (e.keyCode !== 13) return
      this.inputStack.forEach(function (cb) {cb()})
      this.inputStack = []
    }

    domContainer.addEventListener('keydown', this.enterListener)
  }

  addLine (msg, type) {
    let line = document.createElement('span')
    type && line.classList.add(type)
    line.textContent = msg

    this.el.appendChild(line)
    this.el.scrollTop = this.el.scrollHeight
  }

  addError (msg) {
    this.addLine(msg, 'error')
  }

  waitForInput (msg) {
    this.addLine(msg + ' [press enter to continue]')
    return new Promise((resolve) => {
      this.inputStack.push(resolve)
    })
  }

  destroy () {
    this.el.parentNode.removeEventListener('keydown', this.enterListener)
    this.el.remove()
  }
}
