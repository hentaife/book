var $ = require('jquery')
var _ = require('./utils/utils')

var data = {
  name: 'xxx',
  list: [{
    id: 111,
    content: 'www'
  }, {
    id: 112,
    content: 'kkk'
  }]
}

var html = `
<h1>${data.name}</h1>
<ul>
${
  data.list.map(function(item) {
    return `<li dataid=${item.id}>${item.content}</li>`
  }).join('')
}
</ul>
`
_.log(html)
