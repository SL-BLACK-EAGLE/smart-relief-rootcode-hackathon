import { Server } from 'socket.io';

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('subscribe:room', (room: string) => socket.join(room));
  });
};
