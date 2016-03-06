var http = require('http');
var sockjs = require('sockjs');
var express = require('express');
    
var app = express();
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/client.html');
});
app.get('/client.js', function (request, response) {
    response.sendFile(__dirname + '/chatClient.js');
});
    
var clients = {};
function broadcast(message){
    for (var client in clients) {
        clients[client].write(JSON.stringify(message));
    }
}

var sockServer = sockjs.createServer();
sockServer.on('connection', function (conn) {
    clients[conn.id] = conn;

    conn.on('data', function (message) {
        console.log(message);
        broadcast(JSON.parse(message));
    });
        
    conn.on('close', function () {
        delete clients[conn.id];
    });
});

var httpServer = http.createServer(app);
sockServer.installHandlers(httpServer, { prefix: '/chat' });
var port = 1337;
httpServer.listen(port);
