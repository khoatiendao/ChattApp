const { Server } = require("socket.io");

const io = new Server(3001, { cors: 
    {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    } 
});

let onlineUsers = []

// listen to a connection
io.on("connection", (socket) => {
    console.log("new connection", socket.id)

    // Add user Online server
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        
        console.log("online user", onlineUsers)

        io.emit("getOnlineUsers", onlineUsers)
    });

    // send Message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => 
            user.userId === message.recipientId
        );
        console.log(message.recipientId);

        if(user) {
            io.to(user.socketId).emit("getMessage", message)
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            })
        }
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId != socket.id)

        io.emit("getOnlineUsers", onlineUsers)
    })
});
