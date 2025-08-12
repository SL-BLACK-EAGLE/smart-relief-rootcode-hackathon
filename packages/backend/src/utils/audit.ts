import prisma from '../config/database';

export async function writeAuditLog(params: {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const { userId, action, resource, resourceId, oldValues, newValues, ipAddress, userAgent } = params;
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || undefined,
        action,
        resource,
        resourceId: resourceId || undefined,
        oldValues: oldValues as any,
        newValues: newValues as any,
        ipAddress: ipAddress || undefined,
        userAgent: userAgent || undefined,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write audit log', err);
  }
}
