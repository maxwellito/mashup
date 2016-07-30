/**
 * Telepromptr class
 * Dummy fake terminal interface to provide
 * log and interaction with the user.
 */
class Telepromptr {

  /**
   * Set the prompt DOM to display content, and
   * start listening to the keybord event for
   * future interaction with the user.
   * @param  {DOMElement} domContainer Parent DOM element
   */
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

  /**
   * Add line to the promptr.
   * A specific style can be provided.
   * @param {string} msg  Text to display
   * @param {string} type Style class to set on the line
   */
  addLine (msg, type) {
    let line = document.createElement('span')
    type && line.classList.add(type)
    line.textContent = msg

    this.el.appendChild(line)
    this.el.scrollTop = this.el.scrollHeight
  }

  /**
   * Quick shortcut to add en error line.
   * Behave exactly like `addLine` without the
   * possibility to add style class.
   * @param {string} msg  Text to display
   */
  addError (msg) {
    this.addLine(msg, 'error')
  }

  /**
   * Add a waiting line on the promptr.
   * This is to wait signal from user to continue.
   * The method will display the text provided as
   * parameter and add '[press enter to continue]'
   * and return a promise which will be resolved
   * once the user will press start.
   * @param {string} msg  Text to display
   * @return {Promise}    Wainting input promise
   */
  waitForInput (msg) {
    this.addLine(msg + ' [press enter to continue]')
    return new Promise((resolve) => {
      this.inputStack.push(resolve)
    })
  }

  /**
   * Ultimate method to destroy the telepromptr.
   * It self destruct by removing the DOM and
   * stop listening to keyboard events.
   */
  destroy () {
    this.el.parentNode.removeEventListener('keydown', this.enterListener)
    this.el.remove()
  }
}
