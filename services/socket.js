
const { Server } = require('socket.io')

const SocketApp = (server) => {

    const io = new Server(server, {
        cors: {
            origin: '*',
        }
    });

    io.on("connection", (socket) => {
       console.log(`Usuario conectado`, socket.id);

       socket.on("join_room", ({user, room}) => {
        socket.join(room)
       })
    });

}

module.exports = {
    SocketApp
}
