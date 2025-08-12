import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { signToken } from '../config/jwt';

export const registerUser = async (email: string, password: string, role: string, profile?: any) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    (err as any).status = 409;
    throw err;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      role: role as any,
      profile: profile
        ? {
            create: {
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              avatar: profile.avatar,
              dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
              gender: profile.gender,
              address: profile.address,
              city: profile.city,
              state: profile.state,
              country: profile.country,
              zipCode: profile.zipCode,
              latitude: profile.latitude,
              longitude: profile.longitude,
              skills: profile.skills || [],
              availability: profile.availability,
              organizationName: profile.organizationName,
              organizationType: profile.organizationType,
              taxId: profile.taxId,
            },
          }
        : undefined,
    },
    select: { id: true, email: true, role: true }
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid credentials');
    (err as any).status = 401;
    throw err;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    (err as any).status = 401;
    throw err;
  }
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, email: user.email, role: user.role }, token };
};
