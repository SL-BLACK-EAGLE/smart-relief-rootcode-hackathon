export type SocketAuth = {
  id: string;
  email?: string;
  role?: 'USER' | 'VOLUNTEER' | 'ADMIN';
};
