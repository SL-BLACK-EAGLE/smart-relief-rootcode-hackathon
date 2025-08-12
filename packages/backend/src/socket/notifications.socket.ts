import { Server, Socket } from 'socket.io';

export const bindNotificationsSocket = (io: Server) => {
  io.of('/notifications').on('connection', (socket: Socket) => {
    socket.on('subscribe:user', (userId: string) => socket.join(userId));
  });
};
