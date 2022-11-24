// Server
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const formatMessage = require("./utils/messages");


const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getUsersfromScore,

} = require("./utils/users");
//const { Socket } = require('dgram');


const app = express();
const server = http.createServer(app);
const io = socketio(server); //socket set up

//app.set('trust proxy', true)




const PORT = 4000 || process.env.PORT;

//Set static folder to frontend
app.use(express.static(path.join(__dirname, 'public')));

/*app.get("/", function(req,res){
    res.sendFile((path.join(__dirname,'public') ));
}); */


//Run server and now we can run index and chat html
server.listen(PORT, () => console.log(`Server running on client PORT : ${PORT}`));







//Run when clients connect
io.on('connection', socket => {
    console.log(socket.id + 'New Websocket connection');

    //console.log(io.of("/").adapter);
    socket.on("joinRoom", ({ username, LEVEL }) => {

        const user = userJoin(socket.id, username, LEVEL, 0);

        socket.join(user.room);
        // Emit from server to single client
        // Welcome current user// socket.emit('Name you want','data you emit');
        socket.emit('welcomemessage', `Welcome ${user.username} to the Game!`);

        // Broadcast to all clients when a user connects (except user)
        //socket.broadcast.to(user.room).emit("message",
        //formatMessage(botName, `${user.username} has joined the room`));

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });



    });

    socket.on('buttonPressed', Level => {
        console.log(Level);
        io.to(Level).emit("startplayfromserver");

    });



    socket.on("Deleteword", inputValue => {
        console.log(inputValue);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("startdeletefromserver", inputValue);
    });




    socket.on('showscore', ({ username, LEVEL, score }) => {
        console.log('showscore');
        const removeuser = userLeave(socket.id);
        const user = userJoin(socket.id, username, LEVEL, score);

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

    });

    socket.on('Gameover', LEVEL => {
        console.log(socket.id + ' serverhere');

        const user = getCurrentUser(socket.id);
        socket.to(LEVEL).emit("FinalUsers", {
            users: getRoomUsers(user.room)
        });


    });

    socket.on("showWinners", maxscore => {
        console.log(socket.id + " " + maxscore);

        const user = getCurrentUser(socket.id);
        socket.to(user.room).emit("Winners", {

            users: getUsersfromScore(maxscore, user.room),
        });
    });

    socket.on("ReStart", () => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("Restartfromserver");

    });



    // Run when client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

    });


});




