import { Server } from "socket.io" //This sets up WebSocket support on your server.
import http from "http"  //Needed to create the HTTP server manually 
import express from "express"

// We create an Express server to handle HTTP requests.
// Then, we pass the server to Socket.IO to set up the WebSocket connection.
const app = express()
const server = http.createServer(app)
// cors: Cross-Origin Resource Sharing configuration - who all can send you requests from frontend
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", 'https://pralaysetu.vercel.app'],
        methods: ['GET', 'POST', 'PUT'],
    },
});


// used to store online user 
//backend server is always running, so we can store the online user in memory
const userSocketMap = {}  //{userId: SocketId}
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//Event get triggered when new clients connect to the server
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    const userName = socket.handshake.query.userName
    if (userId) {
        userSocketMap[userId] = socket.id
    }
    //used to send event to all the connected Client
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    console.log("User connected with socket id = ", socket.id, " and name = ", userName)
    console.log("Number of online users are", Object.keys(userSocketMap).length)

    socket.on("disconnect", () => {
        console.log("User disconnected with socket id = ", socket.id, " and name = ", userName)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})


export { io, server, app }

