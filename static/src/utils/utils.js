// test
exports.log = function() {
  console && console.log && console.log.apply(console, arguments)
}
