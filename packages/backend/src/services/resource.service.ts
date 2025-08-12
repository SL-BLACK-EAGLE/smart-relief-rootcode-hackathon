import prisma from '../config/database';
import { bboxFromCenter, haversineKm } from '../utils/geo';

export const getResourceById = (id: string) => prisma.resource.findUnique({ where: { id } });

export const listResourcesService = () => prisma.resource.findMany({ orderBy: { createdAt: 'desc' } });

export const createResourceService = (data: any) =>
	prisma.resource.create({
		data: {
			...data,
			expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
		},
	});

export const updateResourceService = (id: string, data: any) =>
	prisma.resource.update({
		where: { id },
		data: { ...data, expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined },
	});

export const allocateResourceService = async (payload: {
	resourceId: string;
	aidRequestId: string;
	quantityAllocated: number;
}) => {
	const resource = await prisma.resource.findUnique({ where: { id: payload.resourceId } });
	if (!resource) return { error: 'Resource not found' } as const;
	const aid = await prisma.aidRequest.findUnique({ where: { id: payload.aidRequestId } });
	if (!aid) return { error: 'Aid request not found' } as const;
	if (resource.quantity < payload.quantityAllocated) return { error: 'Insufficient resource quantity' } as const;

	const allocation = await prisma.$transaction(async (tx) => {
		const created = await tx.resourceAllocation.create({
			data: {
				resourceId: payload.resourceId,
				aidRequestId: payload.aidRequestId,
				quantityAllocated: payload.quantityAllocated,
				status: 'ALLOCATED',
			},
		});
		await tx.resource.update({ where: { id: payload.resourceId }, data: { quantity: { decrement: payload.quantityAllocated } } });
		return created;
	});
	return { allocation } as const;
};

export const findResourcesNearAidService = async (
	aidRequestId: string,
	radiusKm: number,
	category?: string
) => {
	const aid = await prisma.aidRequest.findUnique({ where: { id: aidRequestId } });
	if (!aid) return { error: 'Aid request not found' } as const;
	const box = bboxFromCenter(aid.latitude, aid.longitude, radiusKm);
	const where: any = {
		status: 'AVAILABLE',
		latitude: { gte: box.minLat, lte: box.maxLat },
		longitude: { gte: box.minLon, lte: box.maxLon },
	};
	if (category) where.category = category;
	const candidates = await prisma.resource.findMany({ where });
	const items = candidates
		.map((r) => ({
			...r,
			distanceKm: r.latitude && r.longitude ? haversineKm(aid.latitude, aid.longitude, r.latitude, r.longitude) : null,
		}))
		.filter((r) => r.distanceKm !== null && (r.distanceKm as number) <= radiusKm)
		.sort((a, b) => (a.distanceKm as number) - (b.distanceKm as number));
	return { items } as const;
};
