require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;


// Create HTTP server
const server = http.createServer(app);


// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ],
    credentials: true
  }
});


// Socket connection
io.on("connection", (socket) => {

  console.log("🔌 New user connected:", socket.id);


  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });

});


// Make io accessible in controllers
app.set("io", io);



const startServer = async () => {
  try {

    await connectDB();


    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });


  } catch (err) {

    console.error("Server failed to start.", err);

  }
};


startServer();