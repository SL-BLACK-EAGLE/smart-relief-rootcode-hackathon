import dotenv from 'dotenv';
import app from './app';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setIO } from './config/socket';
import { registerSocketHandlers } from './socket';
import { bindEmergencySocket } from './socket/emergency.socket';
import { bindVolunteerSocket } from './socket/volunteer.socket';
import { bindNotificationsSocket } from './socket/notifications.socket';
import { verifyToken } from './config/jwt';
import { env } from './config/env';

// Load .env.local first (if present) then .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const port = env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: { origin: env.corsOrigins as any },
});
setIO(io);
registerSocketHandlers(io);
bindEmergencySocket(io);
bindVolunteerSocket(io);
bindNotificationsSocket(io);
io.use((socket, next) => {
	const token = (socket.handshake.auth?.token as string) || (socket.handshake.query?.token as string);
	if (!env.socketAuthRequired) {
		if (token) {
			try { socket.data.user = verifyToken(token); } catch { /* ignore */ }
		}
		return next();
	}
	if (!token) return next(new Error('auth token required'));
	try {
		socket.data.user = verifyToken(token);
		return next();
	} catch {
		return next(new Error('invalid token'));
	}
});

io.on('connection', (socket) => {
	const user = socket.data.user as { id?: string } | undefined;
	if (user?.id) socket.join(user.id);
	socket.on('subscribe:service', (serviceId: string) => socket.join(serviceId));
	socket.on('subscribe:user', (userId: string) => socket.join(userId));
});

// Secure namespace with JWT enforcement
const secureNs = io.of('/realtime');
secureNs.use((socket, next) => {
	const token = (socket.handshake.auth?.token as string) || (socket.handshake.query?.token as string);
	if (!token) return next(new Error('auth token required'));
	try {
		const payload = verifyToken(token);
		socket.data.user = payload;
		return next();
	} catch {
		return next(new Error('invalid token'));
	}
});

secureNs.on('connection', (socket) => {
	const user = socket.data.user as { id: string } | undefined;
	if (user?.id) socket.join(user.id); // auto-subscribe to own user room
	socket.on('subscribe:service', (serviceId: string) => socket.join(serviceId));
});

server.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Backend API listening on http://localhost:${port}`);
});

