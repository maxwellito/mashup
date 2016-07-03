// var requestStream = Rx.Observable.create(function (observer) {
//   var z = setInterval(function () {
//     var x = Math.random();
//     if (x > .9) {
//       observer.onCompleted('END');
//     }
//     else if (x < .1) {
//       observer.onError(x);
//     }
//     else {
//       observer.onNext(x);
//     }
//   }, 400);
// });
// requestStream.subscribe(function(event) {
//   console.log(event);
// }, function (err) {
//   console.error(err)
// });



var streamA = Rx.Observable.fromEvent(document, 'click')
var streamB = streamA.map(function(e) {
  return e.clientX;
})

Rx.Observable
  .merge(streamA, streamB)
  .subscribe(function (e) {
    console.log(e);
  })

// streamB.subscribe(function (e) {
//   console.log(e);
// })

// var refreshClickXStream = Rx.Observable.fromEvent(document, 'click').map(function(e) {
//   return e.clientX;
// })
// .filter(function (val) {return val > 30})
//
// var refreshClickYStream = Rx.Observable.fromEvent(document, 'click').map(function(e) {
//   return e.clientY;
// })
// .filter(function (val) {return val > 30});
// From event



// refreshClickStream.subscribe(function(event) {
//   console.log(event);
// });

// Rx.Observable
//   .combineLatest(refreshClickYStream, refreshClickXStream, (x, y) => x + '/' + y)
  // .filter(function (val) {return val > 30})
  // .forEach(clickPos => console.log(`Values higger than 30: ${clickPos}`))
  // .subscribe(function (e) {
  //   console.log(e);
  // })

// refreshClickStream.map(function (x) {
//   return x % 2 === 0;
// })

// From observable
// var responseMetastream = Rx.Observable.fromObservable(refreshClickStream)
//   .map(function(e) {
//     console.log('>>>', e)
//     //return Rx.Observable.fromObservable(requestStream);
//   });
