spriteFilters = {
  glitch: (function () {
    return function (context, input) {
      var total = 230400,
        width = 320,
        height = 180,
        ratio = input/128,
        cc = context.getImageData(0, 0, width, height),
        pStart =  Math.round(ratio * total), // Math.round(421500 * this.iStart),
        pStartP = pStart - input, // pStart - Math.round(1201 * this.iDelay),
        pEnd =    pStart + Math.round((total - pStart) * ratio) // pStart + Math.round(421500 * this.iEnd)
      cc.data.copyWithin(pStartP, pStart, pEnd)
      context.putImageData(cc,0,0)
    }
  })(),

  delay: (function () {
    return function (context, input) {

      var width = 320,
        height = 180;

      var cc = context.getImageData(0, 0, width, height),
        originalData = context.getImageData(0, 0, width, height).data

      var v = [
        input / 2,
        input / 16,
        input / 4,
        input / 8
      ]

      var ax = v[input       % 4],
          ay = v[(input + 1) % 4],
          bx = v[(input + 2) % 4],
          by = v[(input + 3) % 4]

      ax = Math.floor(ax) * (ax % 1 > .5 ? 1 : -1)
      ay = Math.floor(ay) * (ay % 1 > .5 ? 1 : -1)
      bx = Math.floor(bx) * (bx % 1 > .5 ? 1 : -1)
      by = Math.floor(by) * (by % 1 > .5 ? 1 : -1)

      var x = 0,
          y = 0

      var byteLength = cc.data.length
      for (var i = 0; i < byteLength; i++) {
        if (i % 4 > 1) {
          continue
        }
        x = Math.floor(i % (width * 4) / 4)
        y = Math.floor(i / (width * 4))
        if (i % 4 === 0) {
          cc.data[i] = originalData[((((x + ax) % width) + ((y + ay) % height) * width)) * 4]
        }
        else {
          cc.data[i] = originalData[((((x + bx) % width) + ((y + by) % height) * width)) * 4 + 1]
        }
      }
      context.putImageData(cc, 0, 0)
    }
  })()

}
