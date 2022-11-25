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
        //WAR
        if(LEVEL == "2600"){
            user.score = 500;
        }

        socket.join(user.room);
        // Emit from server to single client
        // Welcome current user// socket.emit('Name you want','data you emit');
        socket.emit('welcomemessage', `Welcome ${user.username} to the Game!`);

        // Broadcast to all clients when a user connects (except user)
        //socket.broadcast.to(user.room).emit("message",
        //formatMessage(botName, `${user.username} has joined the room`));

        // Send users and room info
        const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });



    });

    socket.on("shuffleDictionary",({DICTIONARY,WARDICTIONARY,CATDICTIONARY})=>{
        const user = getCurrentUser(socket.id);
        const newDICTIONARY = DICTIONARY.sort((a, b) => 0.5 - Math.random());
        const newWARDICTIONARY = WARDICTIONARY.sort((a, b) => 0.5 - Math.random());
        const newCATDICTIONARY = CATDICTIONARY.sort((a, b) => 0.5 - Math.random());

        io.to(user.room).emit("sendDictoroom", { newDICTIONARY,newWARDICTIONARY,newCATDICTIONARY});

    } );

    socket.on('buttonPressed', Level => {
        console.log(Level);
        io.to(Level).emit("startplayfromserver");

    });



    socket.on("Deleteword", inputValue => {
        console.log(inputValue);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("startdeletefromserver", inputValue);
    });


    
    
    socket.on("nuclear",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score = 0;
          });

         //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });


    });
 
    socket.on("missile",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score -= 100;
        });
        user.score = score;
        //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });

        
    });

    socket.on("bomb",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score -= 50;
        });
        user.score = score;
        //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });


        
    });

    socket.on("gun",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score -= 25;
        });
        user.score = score;
        //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });

    });
    socket.on("knife",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score -= 10;
        });
        user.score = score;
        //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });

        
    });
    socket.on("angel",score=>{
        const user = getCurrentUser(socket.id);
        const users = getRoomUsers(user.room);
        users.forEach((user) => {
            user.score += 50;
        });
        user.score = score;
        //const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });

        
    });
    

    socket.on('showscore', ({ username, LEVEL, score }) => {
        console.log('showscore');
        const removeuser = userLeave(socket.id);
        const user = userJoin(socket.id, username, LEVEL, score);

        const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
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
        const users = getRoomUsers(user.room);
        let countuser =0;
        users.forEach(() => {
            countuser++;
        });

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
            numuser : countuser
        });

    });


});




