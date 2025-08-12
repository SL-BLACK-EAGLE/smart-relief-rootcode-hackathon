import { Server, Socket } from 'socket.io';

export const bindEmergencySocket = (io: Server) => {
  io.of('/emergency').on('connection', (socket: Socket) => {
    socket.on('emergency:report', (payload) => {
      io.of('/emergency').emit('emergency:new', payload);
    });
  });
};
