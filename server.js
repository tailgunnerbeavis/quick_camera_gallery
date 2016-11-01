var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');
var multer = require('multer');
var fs = require('fs');

var express = require('express');
var app = new express();
var port = 3000;

var uploading = multer({
  dest: __dirname + '/uploads/'
});

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use('/upload', express.static(__dirname + '/uploads'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get("/gallery.css", function(req, res) {
  res.sendFile(__dirname + '/gallery.css');
});

app.get("/gallery", function(req, res) {
  res.sendFile(__dirname + '/gallery.json');
});

app.post("/gallery", uploading.single('files'), function(req, res) {
	var obj;
	console.log('Body: ', req.body);
	console.log('File: ', req.file);
	fs.readFile(__dirname + '/gallery.json', 'utf8', function (err, data) {
		if (err) throw err;
		obj = JSON.parse(data);
		obj.gallery.push(req.file.filename);
		fs.writeFile(__dirname + '/gallery.json', JSON.stringify(obj), function (err) {
			if (err) return console.log(err);
			console.log(obj);
		});
	});
	res.sendFile(__dirname + '/gallery.json');
});

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
  }
});