var UserName;
var socket;
$ ('#btn').click (function () {
  socket = io ('http://10.0.0.28:3000');
  socket.on ('ID', function (data) {
    jQuery ('#qrcodeCanvas').qrcode ({
      width: 200,
      height: 200,
      text: data.socketID,
    });
  });
  UserName = $ ('#user').val ();
  socket.on ('scan', function (data) {
    var st = '<p> Msg From Scan   :  ' + data.username + '</p>';
    $ ('#chat').html ($ ('#chat').html () + st);
  });
  $ ('#send').removeAttr ('disabled');
  $ ('#btn').attr ('disabled', 'disabled');
  socket.emit ('UserConnected', {User: $ ('#user').val ()});

  socket.on ('UserDis', data => {
    var st = '<p>' + data.disMsg + '</p>';
    $ ('#chat').html ($ ('#chat').html () + st);
  });

  socket.on ('NewUser', data => {
    var st = '<p> New User : ' + data.User + '</p>';
    $ ('#chat').html ($ ('#chat').html () + st);
  });

  socket.on ('NewMsg', data => {
    var st = '<p>' + data.User + ' : ' + data.Message + '</p>';
    $ ('#chat').html ($ ('#chat').html () + st);
  });

  socket.on ('Online', data => {
    $ ('#btn').val ('Online : ' + data.Online);
  });
});

$ ('#send').attr ('disabled', 'disabled');

$ ('#send').click (function () {
  socket.emit ('Msg', {User: UserName, Message: $ ('#msg').val ()});
  $ ('#chat').html (
    $ ('#chat').html () + '<p>You : ' + $ ('#msg').val () + '</p>'
  );
  $ ('#msg').val ('');
});
