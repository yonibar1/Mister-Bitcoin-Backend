const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null;
var gSocketBySessionIdMap = {};

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
    const sharedSession = require('express-socket.io-session');
    gIo.use(
        sharedSession(session, {
            autoSave: true,
        })
    );
    gIo.on('connection', (socket) => {
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket;
        socket.on('disconnect', (socket) => {
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null;
            }
        });
        socket.on('user msg', (topic) => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('private msg', (topic) => {
            console.log(topic, 'Topic PM');
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('order topic', (topic) => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('chat newMsg', (msg) => {
            gIo.to(socket.myTopic).emit('chat addMsg', msg);
        });
        socket.on('review topic', (topic) => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            logger.debug('Session ID is', socket.handshake.sessionID);
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('review addReview', (review) => {
            gIo.to(socket.myTopic).emit('review-added', review);
        });
        socket.on('add msg', (msg) => {
            socket.broadcast.emit('show msg', msg);
        });
        socket.on('add private msg', (msg) => {
            console.log('msg:', msg)
            console.log(socket.myTopic,'SOCKET TOPIC');
            socket.broadcast.emit('show private msg', msg);
        });
        socket.on('orderSent', (order) => {
            socket.broadcast.emit('addOrder', order);
        });
    });
}

function emit({ type, data }) {
    gIo.emit(type, data);
}

function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data);
}

// Send to all sockets BUT not the current socket
function broadcast({ type, data }) {
    const store = asyncLocalStorage.getStore();
    const { sessionId } = store;
    if (!sessionId)
        return logger.debug(
            'Shoudnt happen, no sessionId in asyncLocalStorage store'
        );
    const excludedSocket = gSocketBySessionIdMap[sessionId];
    if (!excludedSocket)
        return logger.debug(
            'Shouldnt happen, No socket in map',
            gSocketBySessionIdMap
        );
    excludedSocket.broadcast.emit(type, data);
}

module.exports = {
    connectSockets,
    emit,
    broadcast,
};
