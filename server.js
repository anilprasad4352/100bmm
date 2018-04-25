require('dotenv').config()
var express = require('express')
var path = require('path')
var history = require('connect-history-api-fallback')

var staticMiddleWare = express.static('dist')

var app = express()

app.use(staticMiddleWare)
app.use(history())
app.use(staticMiddleWare)

app.get('/', function (req, res) {
  res.render(path.join(__dirname, 'dist/index.html'))
})

app.set('port', (process.env.PORT || 8080))
app.listen(app.get('port'), () => console.log('server started ', app.get('port')))
