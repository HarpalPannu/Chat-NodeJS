var express = require ('express');
var app = express ();
var path = require ('path');
var server = require ('http').createServer (app);
var io = require ('socket.io') (server);
var port = process.env.PORT || 3000;

server.listen (port, () => {
  console.log ('Server listening at port %d', port);
});

app.use (express.static (path.join (__dirname, 'public')));

Object.size = function (obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty (key)) size++;
  }
  return size;
};

var Sockets = {};
io.on ('connection', socket => {
  Sockets[socket.id] = socket;
  
  socket.emit ('ID', {
    socketID: socket.id,
  });

  socket.on ('gotID', data => {
    Sockets[data.ID].emit ('scan', {
      data: 'connected',
      username: data.username,
    });
  });

  console.log ('Connected : ' + Object.size (Sockets));

  socket.on ('disconnect', function () {
    var disconnectMsg = {
      disMsg: 'Disconnected : ' + Sockets[socket.id].user,
    };
    delete Sockets[socket.id];
    console.log ("Disconnected " + Object.size(Sockets) + " Left" );
    io.emit ('Online', {Online: Object.size(Sockets) - 1});
    socket.broadcast.emit ('UserDis', disconnectMsg);
  });

  socket.on ('UserConnected', function (data) {
    Sockets[socket.id].user = data.User;
    socket.broadcast.emit ('NewUser', data);
    io.emit ('Online', {Online: Object.size(Sockets) - 1});
  });

  socket.on ('Msg', function (data) {
    var MsgSend = {
      User: data.User,
      Message: data.Message,
    };
    socket.broadcast.emit ('NewMsg', MsgSend);
  });

  socket.on ('error', function (err) {
    console.log ('received error from socket:', socket.id);
    console.log (err);
  });
});
