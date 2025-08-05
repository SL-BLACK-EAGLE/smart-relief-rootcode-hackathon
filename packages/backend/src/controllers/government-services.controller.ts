import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  CreateGovernmentServiceRequest,
  GovernmentServiceSearchParams,
  ServiceAvailabilityRequest 
} from '../../../shared/src/types/government-services.types';
import { AuthenticatedRequest } from '../types/express.types';

const prisma = new PrismaClient();

// Get all government services with optional filtering
export const getGovernmentServices = async (req: Request, res: Response) => {
  try {
    const {
      category,
      department,
      location,
      radius = 10,
      availableDate,
      requiresOnlineBooking,
      query,
      page = 1,
      limit = 20
    } = req.query as any;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {
      isActive: true
    };

    // Apply filters
    if (category) {
      where.category = category;
    }

    if (department) {
      where.department = {
        contains: department,
        mode: 'insensitive'
      };
    }

    if (requiresOnlineBooking !== undefined) {
      where.allowsOnlineBooking = requiresOnlineBooking === 'true';
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { department: { contains: query, mode: 'insensitive' } }
      ];
    }

    // Location-based filtering would require PostGIS queries
    // For now, we'll implement basic filtering without geographic calculations

    const [services, total] = await Promise.all([
      prisma.governmentService.findMany({
        where,
        include: {
          timeSlots: {
            where: { isActive: true }
          },
          _count: {
            select: {
              appointments: {
                where: {
                  status: { in: ['SCHEDULED', 'CONFIRMED'] }
                }
              }
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { name: 'asc' }
      }),
      prisma.governmentService.count({ where })
    ]);

    res.json({
      success: true,
      data: services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching government services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch government services',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get government service by ID
export const getGovernmentServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.governmentService.findUnique({
      where: { id },
      include: {
        timeSlots: {
          where: { isActive: true },
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
          ]
        },
        appointments: {
          where: {
            appointmentDate: {
              gte: new Date()
            }
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phoneNumber: true
                  }
                }
              }
            }
          },
          orderBy: { appointmentDate: 'asc' }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Government service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching government service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch government service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new government service (Admin only)
export const createGovernmentService = async (req: Request, res: Response) => {
  try {
    const serviceData: CreateGovernmentServiceRequest = req.body;

    const service = await prisma.governmentService.create({
      data: {
        name: serviceData.name,
        description: serviceData.description,
        category: serviceData.category,
        department: serviceData.department,
        requiresDocuments: serviceData.requiresDocuments ?? true,
        avgProcessingTime: serviceData.avgProcessingTime,
        cost: serviceData.cost,
        allowsOnlineBooking: serviceData.allowsOnlineBooking ?? true,
        maxAdvanceBookingDays: serviceData.maxAdvanceBookingDays ?? 30,
        slotDuration: serviceData.slotDuration ?? 30,
        bufferTime: serviceData.bufferTime ?? 5,
        maxDailySlots: serviceData.maxDailySlots ?? 50,
        requiredDocuments: serviceData.requiredDocuments,
        eligibilityCriteria: serviceData.eligibilityCriteria,
        officeLocation: serviceData.officeLocation,
        contactInfo: serviceData.contactInfo
      },
      include: {
        timeSlots: true
      }
    });

    res.status(201).json({
      success: true,
      data: service,
      message: 'Government service created successfully'
    });
  } catch (error) {
    console.error('Error creating government service:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create government service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update government service (Admin only)
export const updateGovernmentService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const service = await prisma.governmentService.update({
      where: { id },
      data: updateData,
      include: {
        timeSlots: true,
        _count: {
          select: {
            appointments: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: service,
      message: 'Government service updated successfully'
    });
  } catch (error) {
    console.error('Error updating government service:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Government service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update government service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete government service (Admin only)
export const deleteGovernmentService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if there are active appointments
    const activeAppointments = await prisma.governmentServiceAppointment.count({
      where: {
        serviceId: id,
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
        appointmentDate: { gte: new Date() }
      }
    });

    if (activeAppointments > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete service with ${activeAppointments} active appointments`
      });
    }

    await prisma.governmentService.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Government service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting government service:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Government service not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete government service',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get service availability
export const getServiceAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const service = await prisma.governmentService.findUnique({
      where: { id },
      include: {
        timeSlots: {
          where: { isActive: true }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Government service not found'
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    // Generate available slots for the date range
    const availableSlotsList: any[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split('T')[0];

      // Find time slots for this day of week
      const dayTimeSlots = service.timeSlots.filter(slot => slot.dayOfWeek === dayOfWeek);

      for (const timeSlot of dayTimeSlots) {
        // Check existing appointments for this date and time
        const existingAppointments = await prisma.governmentServiceAppointment.count({
          where: {
            serviceId: id,
            appointmentDate: {
              gte: new Date(`${dateStr}T00:00:00`),
              lt: new Date(`${dateStr}T23:59:59`)
            },
            timeSlot: timeSlot.startTime,
            status: { in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'] }
          }
        });

        const availableSlotsCount = timeSlot.maxAppointments - existingAppointments;

        if (availableSlotsCount > 0) {
          availableSlotsList.push({
            date: dateStr,
            timeSlot: timeSlot.startTime,
            availableSlots: availableSlotsCount,
            estimatedWaitTime: service.avgProcessingTime
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: {
        serviceId: id,
        availableSlots: availableSlotsList,
        holidays: [], // This would come from a holidays table/API
        specialClosures: []
      }
    });
  } catch (error) {
    console.error('Error fetching service availability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service availability',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get service categories
export const getServiceCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.governmentService.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    res.json({
      success: true,
      data: categories.map(cat => ({
        category: cat.category,
        count: cat._count.category
      }))
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Search government services
export const searchGovernmentServices = async (req: Request, res: Response) => {
  try {
    const { query, category, department, location } = req.query as GovernmentServiceSearchParams;

    const searchWhere: any = {
      isActive: true
    };

    if (query) {
      searchWhere.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { department: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (category) {
      searchWhere.category = category;
    }

    if (department) {
      searchWhere.department = {
        contains: department,
        mode: 'insensitive'
      };
    }

    const services = await prisma.governmentService.findMany({
      where: searchWhere,
      include: {
        timeSlots: {
          where: { isActive: true },
          select: {
            dayOfWeek: true,
            startTime: true,
            endTime: true,
            maxAppointments: true
          }
        },
        _count: {
          select: {
            appointments: {
              where: {
                status: { in: ['SCHEDULED', 'CONFIRMED'] },
                appointmentDate: { gte: new Date() }
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error searching government services:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search government services',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
