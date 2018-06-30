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
    var st = `<div class="container">
    <div id="userbox"></div>
    <p>${data.disMsg}</p>
    <span class="time-left">11:02</span>
    </div>`;
    $ ('#chat').html ($ ('#chat').html () + st);
  });

  socket.on ('NewUser', data => {
    var st = `<div class="container">
    <div id="userbox"></div>
    <p>New User :  ${data.User}</p>
    <span class="time-left">11:02</span>
    </div>`;
    $ ('#chat').html ($ ('#chat').html () + st);
  });

  socket.on ('NewMsg', data => {
    // var st = '<p>' + data.User + ' : ' + data.Message + '</p>';

    var st = `<div class="container">
    <div id="userbox">${data.User}</div>
    <p>${data.Message}</p>
    <span class="time-left">11:02</span>
    </div>`;
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
$ ('#msg').keypress (function (event) {
  if (event.keyCode === 13) {
    socket.emit ('Msg', {User: UserName, Message: $ ('#msg').val ()});
    $ ('#chat').html (
      $ ('#chat').html () + '<p>You : ' + $ ('#msg').val () + '</p>'
    );
    $ ('#msg').val ('');
  }
});
