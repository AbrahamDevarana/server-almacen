const {Server} = require('socket.io');
var io = null 
module.exports = {
    connect: (server) => {
        io = new Server(server, {
            
            cors: {
                origin: '*',
            }
        });
    },
    emit: (event, values) => {
        if ( io ) {
            io.emit(event, values);
        }
    },
    to: (event, values) => {
        if ( io ) {
            io.to(event).emit(event, values);
        }
    },
    on: (event, callback) => {
        if ( io ) {
            io.on(event, callback);
        }
    }
    
}