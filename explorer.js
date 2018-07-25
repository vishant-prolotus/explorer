var express = require('express')
  , path = require('path')
  , request = require('request')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , config = require('./config')
  , cron = require('node-cron')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , request = require('request')
var http = require('http');
const shell = require('shelljs');
var app = express();
var moment = require('moment');
app.set('port', 3001);
var server = http.createServer(app);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', function (req, res) {

  var arr = req.url.split('/');
  var regEx = /^([A-Fa-f0-9]{64})$/.test(arr[2]);
  if (arr.length == 3) {
    var baseUrl = config[arr[1]];

    getBlockCount(baseUrl).then(function (blockcount) {

      getConnectionCount(baseUrl).then(function (connectioncount) {

        getDifficulty(baseUrl).then(function (difficulty) {

          if (regEx) {

            var HttpRequest = baseUrl + '/api/getrawtransaction?txid=' + arr[2] + '&decrypt=1';
            request(HttpRequest, { json: true }, function (error, response, body) {

              res.render("index", {
                "message": body, "error": null, "logo": arr[1], "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connectioncount },
                "cur": config.currencies, "url": config.url, "moment": moment
              });

            });

          } else {

            var HttpRequest = baseUrl + '/ext/getaddress/' + arr[2];
            request(HttpRequest, { json: true }, function (error, response, body) {

              res.render("address", {
                "message": body, "error": null, "logo": arr[1], "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connectioncount },
                "cur": config.currencies, "url": config.url, "moment": moment
              });

            });

          }
        }).catch(function (error) {

          res.render("index", {
            "message": null, "error": null, "logo": arr[1], "data": { "difficulty": 'N/A', "blockcount": blockcount, "connections": connectioncount },
            "cur": config.currencies, "url": config.url, "moment": moment
          });

        })

      }).catch(function (error) {

        res.render("index", {
          "message": null, "error": null, "logo": arr[1], "data": { "difficulty": 'N/A', "blockcount": "N/A", "connections": connectioncount },
          "cur": config.currencies, "url": config.url, "moment": moment
        });

      })

    }).catch(function (error) {

      res.render("index", {
        "message": null, "error": null, "logo": arr[1], "data": { "difficulty": 'N/A', "blockcount": "N/A", "connections": "N/A" },
        "cur": config.currencies, "url": config.url, "moment": moment
      });

    })

  } else {

    res.render("index", {
      "message": null, "error": null, "logo": null, "data": { "difficulty": 'N/A', "blockcount": "N/A", "connections": "N/A" },
      "cur": config.currencies, "url": config.url, "moment": moment
    });

  }

})

app.get('*', function (req, res) {
  var baseUrl = config.ESCO;

  getBlockCount(baseUrl).then(function (blockcount) {

    getConnectionCount(baseUrl).then(function (connectioncount) {

      getDifficulty(baseUrl).then(function (difficulty) {

        res.render("index", {
          "message": null, "error": null, "logo": "ESCO",
          "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connectioncount },
          "cur": config.currencies, "moment": moment, "url": config.url
        });

      }).catch(function (error) {

        res.render("index", {
          "message": null, "error": null, "logo": "ESCO", "data": { "difficulty": 'N/A', "blockcount": blockcount, "connections": connectioncount },
          "cur": config.currencies, "url": config.url, "moment": moment
        });

      })
    }).catch(function (error) {

      res.render("index", {
        "message": null, "error": null, "logo": "ESCO", "data": { "difficulty": 'N/A', "blockcount": "N/A", "connections": connectioncount },
        "cur": config.currencies, "url": config.url, "moment": moment
      });

    })
  }).catch(function (error) {

    res.render("index", {
      "message": null, "error": null, "logo": "ESCO", "data": { "difficulty": 'N/A', "blockcount": "N/A", "connections": "N/A" },
      "cur": config.currencies, "url": config.url, "moment": moment
    });

  })
});

function getBlockCount(baseUrl) {

  return new Promise(function (resolve, reject) {
    request(baseUrl + '/api/getblockcount', { json: true }, function (error, response, body) {
      if (!error && body != null && body != undefined) {
        resolve(body);
      } else {
        reject("error");
      }
    })
  })
}

function getConnectionCount(baseUrl) {

  return new Promise(function (resolve, reject) {
    request(baseUrl + '/api/getconnectioncount', { json: true }, function (error, response, body) {
      if (!error && body != null && body != undefined) {
        resolve(body);
      } else {
        reject("error");
      }
    })
  })

}

function getDifficulty(baseUrl) {

  return new Promise(function (resolve, reject) {
    request(baseUrl + '/api/getdifficulty', { json: true }, function (error, response, body) {
      if (!error && body != null && body != undefined) {
        resolve(body);
      } else {
        reject("error");
      }
    })
  })

}

server.listen(3001);
server.on('error', function (error) {
  console.log(error);
});

server.on('listening', function () {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});

module.exports = app;
