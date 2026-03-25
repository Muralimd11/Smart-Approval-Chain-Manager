const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandlers = (io) => {
  io.on('connection', async (socket) => {
    console.log('New socket connection:', socket.id);

    // Authenticate socket connection
    const token = socket.handshake.auth.token;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (user) {
          socket.userId = user._id.toString();
          socket.join(socket.userId);
          console.log(`User ${user.name} (${user.role}) joined room ${socket.userId}`);
        }
      } catch (error) {
        // Silently handle - user not logged in yet
        console.log('Socket connected without authentication (user not logged in)');
      }
    }

    // Handle custom events
    socket.on('join-room', (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    socket.on('leave-room', (userId) => {
      socket.leave(userId);
      console.log(`User left room: ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};

module.exports = socketHandlers;