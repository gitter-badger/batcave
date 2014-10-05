var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Emitter = require('events').EventEmitter;
var postMan = new Emitter();

var watch = require('node-watch');

app.use(express.static(__dirname + '/public'));
//postMan.emit('fileslist', exes);
watch('./public', function(filename) {
  postMan.emit('filesChanged');
  console.log(filename, ' changed.');
});
// app.get('/', function(req, res){
//   res.send('hello world');
// });


io.on('connection', function (socket) {
  var reload = function(){
    socket.emit('reload');
   }.bind(this);
   postMan.removeListener('filesChanged', reload);
   postMan.on('filesChanged', reload);
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
});

server.listen(3000);