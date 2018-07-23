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
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/explorerdb');
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
  
  if (arr.length == 3) {

    var regEx = /^([A-Fa-f0-9]{64})$/.test(arr[2]);

    var baseUrl = config[arr[1]];

    request(baseUrl + '/api/getdifficulty', { json: true }, function (error, response, body) {

      if (!error && body != null && body != undefined) {

        var difficulty = body;

        request(baseUrl + '/api/getconnectioncount', { json: true }, function (error, response, body) {

          if (!error && body != null && body != undefined) {

            var connections = body;

            request(baseUrl + '/api/getblockcount', { json: true }, function (error, response, body) {

              if (!error && body != null && body != undefined) {

                var blockcount = body;

                if (regEx) {

                  var HttpRequest = baseUrl + '/api/getrawtransaction?txid=' + arr[2] + '&decrypt=1';

                  request(HttpRequest, { json: true }, function (error, response, body) {

                    res.render("index", {
                      "message": body, "error": null, "logo": arr[1], "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connections },
                      "cur": config.currencies, "url": "http://204.48.19.45/api/", "moment": moment
                    });

                  });

                } else {

                  var HttpRequest = baseUrl + '/ext/getaddress/' + arr[2];

                  request(HttpRequest, { json: true }, function (error, response, body) {

                    res.render("address", {
                      "message": body, "error": null, "logo": arr[1], "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connections },
                      "cur": config.currencies, "url": "http://204.48.19.45/api/", "moment": moment
                    });

                  });

                }

              }

            });

          }

        });

      }

    });

  } else {

    var baseUrl = config.esco;

    request(baseUrl + '/api/getdifficulty', { json: true }, function (error, response, body) {

      if (!error && body != null && body != undefined) {

        var difficulty = body;

        request(baseUrl + '/api/getconnectioncount', { json: true }, function (error, response, body) {

          if (!error && body != null && body != undefined) {

            var connections = body;

            request(baseUrl + '/api/getblockcount', { json: true }, function (error, response, body) {

              if (!error && body != null && body != undefined) {

                var blockcount = body;

                res.render("index", {
                  "message": null, "error": null, "logo": "esco",
                  "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connections },
                  "cur": config.currencies, "moment": moment
                });

              }

            });

          }

        })

      }

    });

  }
});

app.use('/webhok', function (req, res) {
  
  console.log('webhok recived');
  shell.exec('./script.sh');
  
})

app.get('*', function (req, res) {

  var baseUrl = config.esco;

  request(baseUrl + '/api/getdifficulty', { json: true }, function (error, response, body) {

    if (!error && body != null && body != undefined) {

      var difficulty = body;

      request(baseUrl + '/api/getconnectioncount', { json: true }, function (error, response, body) {

        if (!error && body != null && body != undefined) {

          var connections = body;

          request(baseUrl + '/api/getblockcount', { json: true }, function (error, response, body) {

            if (!error && body != null && body != undefined) {

              var blockcount = body;

              res.render("index", {
                "message": null, "error": null, "logo": "esco",
                "data": { "difficulty": difficulty, "blockcount": blockcount, "connections": connections },
                "cur": config.currencies, "moment": moment
              });

            }

          });

        }

      })

    }

  });

});

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
