var schedule = require('node-schedule');
var database = require('./db');
var fetch = require('./fetch');
var cors = require('cors');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(cors())

app.listen(port, '0.0.0.0');

console.log('CacheBox started on: ' + port);

app.route('/').get(function (req, res) {
  res.send("<h2>CacheBox for FlagBrew</h2><p>Version 0.0.1</p>")
})


app.route("/api/repos").get(function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  database.get_all("repos", function (data) {
    res.send(data);
  })
});

app.route("/api/repos/:name").get(function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  database.get_one("repos", req.params.name, function (data) {
    res.send(data);
  })
});


var j = schedule.scheduleJob('*/30 * * * *', function () {
  fetch.repos(function (repo) {
    fetch.releases(repo, function (releases) {
      // then we get our readme after waiting 5 seconds
      fetch.readme(repo, function (readme) {
        // then we put it all together and insert it
        database.insert("repos", { releases: releases, readme: readme }, repo)
      })
    });
  });
});
