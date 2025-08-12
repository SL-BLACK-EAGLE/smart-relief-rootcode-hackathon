import prisma from '../config/database';
import { bboxFromCenter, haversineKm } from '../utils/geo';

export const getVolunteerById = (id: string) => prisma.user.findUnique({ where: { id } });

export const listVolunteerTasksService = (status?: string) =>
	prisma.volunteerTask.findMany({ where: status ? ({ status } as any) : undefined, orderBy: { assignedAt: 'desc' } });

export const assignVolunteerService = async (data: any) => {
	const [vol, aid] = await Promise.all([
		prisma.user.findUnique({ where: { id: data.volunteerId } }),
		prisma.aidRequest.findUnique({ where: { id: data.aidRequestId } }),
	]);
	if (!vol) return { error: 'Volunteer not found' } as const;
	if (!aid) return { error: 'Aid request not found' } as const;
	const task = await prisma.volunteerTask.create({
		data: {
			aidRequestId: data.aidRequestId,
			volunteerId: data.volunteerId,
			title: data.title,
			description: data.description,
			latitude: data.latitude,
			longitude: data.longitude,
			estimatedDuration: data.estimatedDuration,
			status: 'ASSIGNED',
		},
	});
	return { task } as const;
};

export const updateVolunteerTaskService = (id: string, input: any) =>
	prisma.volunteerTask.update({
		where: { id },
		data: {
			...input,
			startedAt: input.startedAt ? new Date(input.startedAt) : undefined,
			completedAt: input.completedAt ? new Date(input.completedAt) : undefined,
		},
	});

export const findVolunteersNearAidService = async (aidRequestId: string, radiusKm: number) => {
	const aid = await prisma.aidRequest.findUnique({ where: { id: aidRequestId } });
	if (!aid) return { error: 'Aid request not found' } as const;
	const box = bboxFromCenter(aid.latitude, aid.longitude, radiusKm);
	const volunteers = await prisma.user.findMany({
		where: {
			role: 'VOLUNTEER',
			isActive: true,
			profile: { is: { latitude: { gte: box.minLat, lte: box.maxLat }, longitude: { gte: box.minLon, lte: box.maxLon } } },
		},
		select: { id: true, email: true, phoneNumber: true, profile: { select: { firstName: true, lastName: true, latitude: true, longitude: true } } },
	});
	const items = volunteers
		.map((v) => ({
			...v,
			distanceKm:
				v.profile?.latitude && v.profile?.longitude
					? haversineKm(aid.latitude, aid.longitude, v.profile.latitude, v.profile.longitude)
					: null,
		}))
		.filter((v) => v.distanceKm !== null && (v.distanceKm as number) <= radiusKm)
		.sort((a, b) => (a.distanceKm as number) - (b.distanceKm as number));
	return { items } as const;
};
