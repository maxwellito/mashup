
var canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 180;
canvas.classList.add('canvid');
document.documentElement.appendChild(canvas);
var ctx = canvas.getContext('2d');


var img = new Image();
// img.onload = drawFrame;
img.onerror = function(){console.log('fuck')};
img.src = 'assets/sv/sv_intro.png';

var pos = 0,
    cols = 6,
    pixs = 20 * cols;



var pStart = Math.round(421500 * Math.random()),
    pStartP = pStart - Math.round(1200 * Math.random()),
    pEnd = pStart + Math.round(421500 * Math.random());


function drawFrame() {
    var fx = Math.floor(pos % cols) * 320,
        fy = Math.floor(pos / cols) * 180;

    ctx.clearRect(0, 0, 320, 180); // clear frame
    ctx.drawImage(img, fx, fy, 320, 180, 0, 0, 320, 180);

    var cc = ctx.getImageData(0, 0, 320, 180)

    cc.data.copyWithin(pStartP, pStart, pEnd)
    ctx.putImageData(cc,0,0)

    pos++;
    pos = pos % pixs;

    if (Math.random() > .75) {
      pStart = Math.round(421500 * Math.random());
      pStartP = pStart - Math.round(1200 * Math.random());
      pEnd = pStart + Math.round(421500 * Math.random());
    }


    requestAnimationFrame(drawFrame);
}
