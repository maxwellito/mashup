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
  })(),


  vcr: function(context, input) {
    var playWidth = 63,
        playHeight = 16,
        playArray = [
          // 0: transparent, 1: black, 2: white
          1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
          1,2,2,2,2,2,2,2,1,1,0,1,2,2,1,0,0,0,0,0,0,0,0,0,1,1,2,1,1,0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,
          1,2,2,2,2,2,2,2,2,1,1,1,2,2,1,0,0,0,0,0,0,0,0,1,1,2,2,2,1,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,0,0,0,0,
          1,2,2,1,1,1,1,2,2,2,1,1,2,2,1,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,1,2,2,1,1,1,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,1,0,0,0,
          1,2,2,1,0,0,1,1,2,2,1,1,2,2,1,0,0,0,0,0,0,1,1,2,2,2,1,2,2,2,1,1,1,2,2,2,1,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,1,0,0,
          1,2,2,1,0,0,1,1,2,2,1,1,2,2,1,0,0,0,0,0,0,1,2,2,2,1,1,1,2,2,2,1,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,1,0,
          1,2,2,1,1,1,1,2,2,2,1,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,0,1,1,2,2,1,0,1,1,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1,1,
          1,2,2,2,2,2,2,2,2,1,1,1,2,2,1,0,0,0,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,
          1,2,2,2,2,2,2,2,1,1,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,
          1,2,2,1,1,1,1,1,1,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1,1,
          1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,1,0,
          1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,1,0,0,
          1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,1,1,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,1,0,0,0,
          1,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,0,0,0,0,
          1,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,
          1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0
        ];

    var offset = 10, x, y;

    var width = 320,
      height = 180;

    var cc = context.getImageData(0, 0, width, height)


    for (y = 0; y < playHeight; y++) {
      for (x = 0; x < playWidth; x++) {
        let pixVal = playArray[y*playWidth+x],
          pos = ((y + offset) * width + x + offset) * 4
        if (pixVal === 1) {
          cc.data[pos] = 0
          cc.data[pos+1] = 0
          cc.data[pos+2] = 0
        }
        else if (pixVal === 2) {
          cc.data[pos] = 255
          cc.data[pos+1] = 255
          cc.data[pos+2] = 255
        }
      }
    }

    context.putImageData(cc, 0, 0)
  },


  vcrSnow: function (context, input) {
    var width = 320,
        height = 180,
        pixLength = width * height,
        startPoint = Math.floor(((input + 32) % 128 / 128) * pixLength),
        pixQte = Math.floor(pixLength * (input / 128)),
        fffLength = fff.length

    var cc = context.getImageData(0, 0, width, height)

    var countdown = 1;
    var sqrt = Math.sqrt(pixQte)

    for (var i = 0; i < pixQte; i++) {



      let pos = ((startPoint + i) % pixLength) * 4,
          p = Math.pow(i/pixQte, 2),
          t = Math.floor((1 - p) * 255) //(i & 1) ? 255 : ((i & 2) ? 127 : 64),
          tt = Math.floor((1 - p) * 4)

      // if (i % 100 == 0) console.log(t)

      if (countdown > 0) {
        countdown--
        cc.data[pos]   >>= tt
        cc.data[pos+1] >>= tt
        cc.data[pos+2] >>= tt
        if (countdown === 0) countdown = -(4 + (i & 3))
      }
      else {
        cc.data[pos]   |= t
        cc.data[pos+1] |= t
        cc.data[pos+2] |= t

        countdown++
        if (countdown === 1) countdown = Math.floor(sqrt * p) + (i & 7) + (Math.floor(i / 320) % 2 === 1 ? 320 : 0)
        // console.log(countdown)
      }


      // if (pixVal === 2) {
      //   cc.data[pos]   = Math.min(cc.data[pos] << t, 255)
      //   cc.data[pos+1] = Math.min(cc.data[pos] << t, 255)
      //   cc.data[pos+2] = Math.min(cc.data[pos] << t, 255)
      // }
      // else {
      //   cc.data[pos]   = cc.data[pos] >> t
      //   cc.data[pos+1] = cc.data[pos+1] >> t
      //   cc.data[pos+2] = cc.data[pos+2] >> t
      // }
    }

    context.putImageData(cc, 0, 0)
    // debugger;
  }



}


var fff  = [
  1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
  1,2,2,2,2,2,2,2,1,1,0,1,2,2,1,0,0,0,0,0,0,0,0,0,1,1,2,1,1,0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,
  1,2,2,2,2,2,2,2,2,1,1,1,2,2,1,0,0,0,0,0,0,0,0,1,1,2,2,2,1,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,0,0,0,0,
  1,2,2,1,1,1,1,2,2,2,1,1,2,2,1,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,1,2,2,1,1,1,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,1,0,0,0,
  1,2,2,1,0,0,1,1,2,2,1,1,2,2,1,0,0,0,0,0,0,1,1,2,2,2,1,2,2,2,1,1,1,2,2,2,1,1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,1,0,0,
  1,2,2,1,0,0,1,1,2,2,1,1,2,2,1,0,0,0,0,0,0,1,2,2,2,1,1,1,2,2,2,1,1,1,2,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,1,0,
  1,2,2,1,1,1,1,2,2,2,1,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,0,1,1,2,2,1,0,1,1,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1,1,
  1,2,2,2,2,2,2,2,2,1,1,1,2,2,1,0,0,0,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,1,1,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,
  1,2,2,2,2,2,2,2,1,1,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,
  1,2,2,1,1,1,1,1,1,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1,1,
  1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,1,1,0,
  1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,1,2,2,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,1,1,0,0,
  1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,1,1,1,1,1,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,1,1,0,0,0,
  1,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,1,1,0,0,0,0,
  1,2,2,1,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,1,1,2,2,1,0,0,0,1,2,2,1,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,1,1,0,0,0,0,0,
  1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0
];
