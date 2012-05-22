"use strict";
console.log("Loaded twitter.js");
var express = require('express');

var app = express.createServer();
app.listen(process.env.PORT, function() {
  console.log("Listening on " + process.env.PORT);
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var tweets = [];

app.get('/', function(req, res) {
  var title = 'Chirpie';
  var header = 'Welcome to Chirpie';

  res.render('index', {
    locals: {
      'title': title,
      'header': header,
      'tweets': tweets,
      stylesheets: ['/public/style.css']
    }
  });
});

function acceptsHtml(header) {
  var accepts = header.split(',');
  for (var i=0; i < accepts.length; i+=1) {
    if (accepts[i] === 'text/html') {
      return true;
    }
  }
  return false;
}

app.post('/send', express.bodyParser(), function(req, res) {
  if (req.body && req.body.tweet) {
    tweets.push(req.body.tweet);

    if (acceptsHtml(req.headers.accept)) {
      res.redirect('/', 302);
    } else {
      res.send({status:"ok", message:"Tweet received"});
    }
  } else {
    // no tweet?
    res.send({status:"nok", message:"No tweet received"});
  }
});

app.get('/tweets', function(req, res) {
  res.send(tweets);
});