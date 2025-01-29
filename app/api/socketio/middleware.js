import { io as Client } from 'socket.io-client';
import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('joinPoll', (pollId) => {
        console.log(`Client joined poll: ${pollId}`);
        socket.join(pollId);
      });

      socket.on('leavePoll', (pollId) => {
        socket.leave(pollId);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;