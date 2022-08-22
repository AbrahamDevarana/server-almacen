const {Server} = require('socket.io');
const { decodeToken } = require('./jwtStrategy');
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
        
        if(event === 'join'){
            this.join(event, values)
        }else if ( io ) {
            io.emit(event, values);
        }
    },
    to: (event, values, room) => {
        if ( io ) {
            io.to(event).emit(event, values);
        }
    },
    on: (event, callback) => {
        if ( io ) {
            io.on(event, callback);
        }
    },
    join: (event, values) => {
        
        if ( io ) {
            io.join(event);
        }
    }
    
}