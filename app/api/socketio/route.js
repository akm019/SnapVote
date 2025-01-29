import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

let io;

if (!global.io) {
  io = new Server({
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    transports: ['websocket'],
  });
  global.io = io;

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('joinPoll', (pollId) => {
      console.log(`Client joined poll: ${pollId}`);
      socket.join(pollId);
    });

    socket.on('leavePoll', (pollId) => {
      console.log(`Client left poll: ${pollId}`);
      socket.leave(pollId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

export async function GET(req) {
  return new NextResponse('Socket is running');
}

export const runtime = 'nodejs';