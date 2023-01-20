const socketIo = require('socket.io');

const io = socketIo();


const socketService = (server) => {
    
    // config

    io.attach(server, {
        cors: {
            origin: process.env.CLIENT_URL,
        }
    });

    io.on('connection', (socket) => {
        // count clients
        console.log('Clientes Conectados: ',io.engine.clientsCount);
        socket.on('disconnect', () => console.log('Client disconnected, Hay:', io.engine.clientsCount, 'clientes conectados'));
    });
}

module.exports = {
    socketService,
    io
}