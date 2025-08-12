import { Server, Socket } from 'socket.io';

export const bindVolunteerSocket = (io: Server) => {
  io.of('/volunteer').on('connection', (socket: Socket) => {
    socket.on('task:update', (payload) => {
      io.of('/volunteer').emit('task:update', payload);
    });
  });
};
