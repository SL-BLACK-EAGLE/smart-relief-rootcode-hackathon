import { prisma } from '../config/database';

export const getMe = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    },
  });
};

export const updateMyProfile = async (userId: string, profile: any) => {
  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { profile: { select: { id: true } } } });
  if (existing?.profile?.id) {
    return prisma.userProfile.update({
      where: { id: existing.profile.id },
      data: { ...profile, dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined },
    });
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      profile: {
        create: {
          ...profile,
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
        },
      },
    },
    select: { profile: true },
  });
};

export const updateMyPassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    (err as any).status = 404;
    throw err;
  }
  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.default.compare(currentPassword, user.password);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    (err as any).status = 400;
    throw err;
  }
  const hashed = await bcrypt.default.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { updated: true };
};
