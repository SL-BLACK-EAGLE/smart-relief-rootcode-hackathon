import prisma from '../config/database';
import { aiIntegrationService } from './ai-integration.service';

export const getAidRequest = (id: string) => prisma.aidRequest.findUnique({ where: { id } });

export const listAidRequestsService = async (filters: {
	category?: string;
	status?: string;
	userId?: string;
	page?: number;
	limit?: number;
}) => {
	const where: any = {};
	if (filters.category) where.category = filters.category;
	if (filters.status) where.status = filters.status;
	if (filters.userId) where.userId = filters.userId;
	const page = Math.max(1, filters.page || 1);
	const limit = Math.min(100, Math.max(1, filters.limit || 20));
	const skip = (page - 1) * limit;
	const [items, total] = await Promise.all([
		prisma.aidRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
		prisma.aidRequest.count({ where }),
	]);
	return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
};

export const createAidRequestService = async (
	userId: string,
	data: {
		title: string;
	description: string;
		category: string;
		priority?: number;
		latitude: number;
		longitude: number;
		address?: string | null;
		images?: string[] | null;
	}
) => {
	return prisma.aidRequest.create({
		data: {
			userId,
			title: data.title,
		description: data.description,
			category: data.category as any,
			priority: data.priority ?? 5,
			status: 'PENDING',
			latitude: data.latitude,
			longitude: data.longitude,
			address: data.address ?? undefined,
			images: data.images ?? [],
		},
	});
};

export const updateAidRequestService = async (id: string, data: Partial<{
	title: string;
	description?: string;
	priority?: number;
	status?: string;
	address?: string | null;
	images?: string[] | null;
}>) => {
	const allowed = ['title', 'description', 'priority', 'status', 'address', 'images'] as const;
	const payload: any = {};
	for (const k of allowed) if (k in (data as any)) payload[k] = (data as any)[k];
	return prisma.aidRequest.update({ where: { id }, data: payload });
};

export const analyzeAidRequestService = async (id: string, imageUrl?: string) => {
	const item = await prisma.aidRequest.findUnique({ where: { id } });
	if (!item) return { notFound: true } as const;
	const src = imageUrl || item.images?.[0];
	if (!src) return { error: 'No image available to analyze' } as const;
	const ai: any = await aiIntegrationService.assessDamageFromUrl(src, item.latitude, item.longitude);
	const confidence = typeof ai?.confidence_score === 'number' ? ai.confidence_score : Number(ai?.confidence_score) || 0.5;
	const urgency = Math.min(10, Math.max(1, Math.round(confidence * 10)));
	const updated = await prisma.aidRequest.update({ where: { id }, data: { damageAssessment: ai as any, urgencyScore: urgency } });
	return { request: updated, ai };
};

