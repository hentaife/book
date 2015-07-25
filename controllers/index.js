var path = require('path')
var persis = require('persis')
var bodyParse = require('co-body')
var _ = require('lodash')
var utils = require('../lib/utils')
var config = require('../config')

require('persis').path(path.resolve(__dirname, '../data'))

function *mockDelay() {
  if (config.debug) {
    yield utils.delay(Math.random() * 600 + 200)
  }
}

// 类别
var categories = persis.get('category')
// 文章
var writings = persis.get('writing')

// 获取自增ID
if (!categories.length) {
  categories.maxId = 0
} else {
  categories.maxId = categories.best('id').id || 0
}

if (!writings.length) {
  writings.maxId = 0
} else {
  writings.maxId = writings.best('id').id || 0
}

var successData = {
  success: true
}

var errorData = {
  success: false
}

// home page
exports.index = function *() {
  yield this.render('index')
}

// get categories list
exports.categories = function *() {
  yield mockDelay()

  categories.forEach(function(cat) {
    cat.count = writings.count(function(writing) {
      return writing.catId === cat.id
    })
  })
  this.body = categories
}

// add categories
exports.addCategory = function *() {
  yield mockDelay()

  var data = yield bodyParse.form(this)

  data.id = ++categories.maxId
  categories.push(data)

  this.body = successData
}


// get writing by id
exports.getWriting = function *() {
  yield mockDelay()

  var id = parseInt(this.params.id, 10)

  var writing = writings.find(function(w) {
    return w.id === id
  })

  if (writing) {
    this.body = {
      success: true,
      data: writing
    }
  } else {
    this.body = {
      success: false,
      code: 404
    }
  }
}

// get writings by id
exports.getWritings = function *() {
  yield mockDelay()

  var catId = parseInt(this.params.catId, 10)

  var wts = writings.filter(function(w) {
    return w.catId === catId
  })

  // get summary
  this.body = {
    success: true,
    data: wts
  }
}


// add writing
exports.addWriting = function *() {
  yield mockDelay()

  var data = yield bodyParse.form(this)
  data.id = ++writings.maxId

  writings.push(data)

  this.body = {
    success: true,
    data: {
      id: data.id
    }
  }
}

// edit writing
exports.editWriting = function *() {
  yield mockDelay()

  var data = yield bodyParse.form(this)
  var id = parseInt(this.params.id, 0)

  var writing = writings.find(function(writing) {
    return writing.id === id
  })

  if (writing) {
    delete data.id
    _.assign(writing, data)

    writings.save()
    this.body = successData
  } else {
    this.body = errorData
  }
}

// delete writing
exports.deleteWriting = function *() {
  yield mockDelay()

  var id = parseInt(this.params.id)

  var writing = writings.find(function(writing) {
    return writing.id === id
  })

  if (writing) {
    writings.remove(writing)
    this.body = successData
  } else {
    this.body = errorData
  }
}
