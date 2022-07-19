const {Server} = require('socket.io');

const io = new Server({
    cors: {
        origin: '*',
    }

});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
})

module.exports = io;