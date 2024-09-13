const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")

const server = http.createServer(app);
const io = new Server(server)

const users ={}

io.on('connection', (socket)=>{
    socket.on('new-user-joined', (name)=>{
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
        console.log("New User", name)
    });

    socket.on('user-message', (message)=>{
        socket.broadcast.emit('receive', {message: message, name : users[socket.id] })
        io.emit('message', message)
    });

    socket.on('disconnect', (message)=>{
        socket.broadcast.emit('left',  users[socket.id] )
        delete users[socket.id]
    });
})

app.use(express.static(path.resolve("./public")))


app.get('/', (req, res)=>{
    return res.sendFile("/public/index.html")
})

server.listen(9000, ()=> console.log('Server stated at 9000'))