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
        if(event === 'join'){
            console.log('join', room);
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
    join: (room, user) => {
        
        if ( io ) {
            io.join(room);
        }
        // mostrar miembros de la sala
        io.to(room).emit('members', io.sockets.adapter.rooms[room]);

    }
    
}