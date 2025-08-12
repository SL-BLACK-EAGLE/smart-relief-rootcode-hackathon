import prisma from '../config/database';

export const getDonationById = (id: string) => prisma.donation.findUnique({ where: { id } });

export const listDonationsService = () => prisma.donation.findMany({ orderBy: { createdAt: 'desc' } });

export const createDonationService = (userId: string, data: any) =>
	prisma.donation.create({
		data: {
			donorId: userId,
			amount: data.amount,
			currency: data.currency || 'USD',
			allocation: data.allocation as any,
			impactMetrics: data.impactMetrics as any,
			paymentMethod: data.paymentMethod,
			transactionId: data.transactionId,
			receiptUrl: data.receiptUrl,
			isRecurring: data.isRecurring ?? false,
			recurringPeriod: data.recurringPeriod,
		},
	});
