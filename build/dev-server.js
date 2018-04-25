require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var admin = require('firebase-admin')
var serviceAccount = require('../config/analytics');
// var serviceAccount = require('../config/credentials');

const googleapis = require('googleapis')
const identitytoolkit = googleapis.identitytoolkit('v3')

const authClient = new googleapis.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/firebase'],
  null
)
const VIEW_ID = 'ga:164342743';

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var router = express.Router();
var compiler = webpack(webpackConfig)

app.use('/api', router)
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach((context) => {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// var firebaseAdmin = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://defense-exchange.firebaseio.com'
// })

router.get('/users', (req, res) => {
  authClient.authorize((err) => {
    if (err) {
      return console.error(err)
    }

    let nextPageToken = undefined
    let users = [];
    const getAccounts = () => identitytoolkit.relyingparty.downloadAccount({
        auth: authClient,
        resource: {
            targetProjectId: serviceAccount.project_id,
            maxResults: 200,
            nextPageToken: nextPageToken
        }
    }, (e, results) => {
        if (e) {
            return console.error(err)
        }

        users = users.concat(results.users)
        if (results.nextPageToken) {
            nextPageToken = results.nextPageToken
            return getAccounts()
        } else {
          res.send(users)
        }
    });
    getAccounts()
  })
})

let jwtClient = new googleapis.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null)

router.get('/getReports', (req, res) => {
  jwtClient.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
      return
    }
    let analytics = googleapis.analytics('v3')
    queryData(analytics, req.query, (err, result) => {
      if (err) {
        return res.status(400).send(err);
      }
      return res.status(200).send(result);
    })
  });
})

function queryData(analytics, data, next) {
  analytics.data.ga.get({
    'auth': jwtClient,
    'ids': VIEW_ID,
    'metrics': data.metrics,
    'dimensions': data.dimensions,
    'start-date': data.startDate,
    'end-date': data.endDate,
    'max-results': data.maxResults,
    'sort': data.sort
  }, (err, response) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    return next(null, response);
  });
}

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}