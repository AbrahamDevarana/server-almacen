const {Server} = require('socket.io');
var io = null 
module.exports = {
    connect: (server) => {
        io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL,
            }
        });

        io.on("connection", (socket) => {
            // console.log(`Usuario conectado`, socket.id);
     
            socket.on("join_room", ({user, room}) => {
                socket.join(room)
                // console.log('Joinned', room);
            })          
            
            
        });
        
    },
    emit: (event, values) => {
        
        if(io){
            io.emit(event, values);
        }
        
    },
    to: (event, values, room) => {
        
        if ( io ) {
            console.log('se envio to', event, values, room);
            io.to(room).emit(event, values);
        }
    },
    on: (event, callback) => {
        if ( io ) {
            io.on(event, callback);
        }
    },
    
}