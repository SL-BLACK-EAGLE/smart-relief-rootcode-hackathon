import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types/express.types';

const prisma = new PrismaClient();

// Join queue for a service
export const joinQueue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { serviceId, reason, priority = 'NORMAL' } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if service exists
    const service = await prisma.governmentService.findFirst({
      where: { id: serviceId, isActive: true }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is already in queue for this service
    const existingQueueEntry = await prisma.governmentServiceQueue.findFirst({
      where: {
        serviceId,
        userId,
        status: { in: ['WAITING', 'CALLED'] }
      }
    });

    if (existingQueueEntry) {
      return res.status(400).json({
        success: false,
        message: 'Already in queue for this service'
      });
    }

    // Get current queue length
    const queueLength = await prisma.governmentServiceQueue.count({
      where: {
        serviceId,
        status: 'WAITING'
      }
    });

    const queueEntry = await prisma.governmentServiceQueue.create({
      data: {
        serviceId,
        userId,
        position: queueLength + 1,
        estimatedWaitTime: (queueLength + 1) * service.avgProcessingTime,
        priority,
        reason,
        status: 'WAITING'
      }
    });

    res.status(201).json({
      success: true,
      data: queueEntry,
      message: 'Added to queue successfully'
    });
  } catch (error) {
    console.error('Error joining queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join queue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get queue position
export const getQueuePosition = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const queueEntry = await prisma.governmentServiceQueue.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            name: true,
            department: true,
            avgProcessingTime: true
          }
        }
      }
    });

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: 'Queue entry not found'
      });
    }

    // Authorization check
    if (queueEntry.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update estimated wait time based on current position
    const currentPosition = await prisma.governmentServiceQueue.count({
      where: {
        serviceId: queueEntry.serviceId,
        status: 'WAITING',
        position: { lt: queueEntry.position }
      }
    });

    const updatedEstimate = currentPosition * (queueEntry.service?.avgProcessingTime || 30);

    res.json({
      success: true,
      data: {
        ...queueEntry,
        currentPosition: currentPosition + 1,
        updatedEstimatedWaitTime: updatedEstimate
      }
    });
  } catch (error) {
    console.error('Error getting queue position:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get queue position',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Leave queue
export const leaveQueue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const queueEntry = await prisma.governmentServiceQueue.findUnique({
      where: { id }
    });

    if (!queueEntry) {
      return res.status(404).json({
        success: false,
        message: 'Queue entry not found'
      });
    }

    // Authorization check
    if (queueEntry.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (queueEntry.status !== 'WAITING') {
      return res.status(400).json({
        success: false,
        message: 'Cannot leave queue at this time'
      });
    }

    // Update queue entry status
    await prisma.governmentServiceQueue.update({
      where: { id },
      data: {
        status: 'LEFT_QUEUE',
        leftQueueAt: new Date()
      }
    });

    // Update positions for remaining queue entries
    await prisma.governmentServiceQueue.updateMany({
      where: {
        serviceId: queueEntry.serviceId,
        status: 'WAITING',
        position: { gt: queueEntry.position }
      },
      data: {
        position: { decrement: 1 }
      }
    });

    res.json({
      success: true,
      message: 'Left queue successfully'
    });
  } catch (error) {
    console.error('Error leaving queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to leave queue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get service queue (Admin only)
export const getServiceQueue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const queue = await prisma.governmentServiceQueue.findMany({
      where: {
        serviceId,
        status: { in: ['WAITING', 'CALLED', 'BEING_SERVED'] }
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
      orderBy: { position: 'asc' }
    });

    res.json({
      success: true,
      data: queue
    });
  } catch (error) {
    console.error('Error getting service queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service queue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Call next person in queue (Admin only)
export const callNextInQueue = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Get next person in queue
    const nextInQueue = await prisma.governmentServiceQueue.findFirst({
      where: {
        serviceId,
        status: 'WAITING'
      },
      orderBy: { position: 'asc' },
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
      }
    });

    if (!nextInQueue) {
      return res.status(404).json({
        success: false,
        message: 'No one waiting in queue'
      });
    }

    // Update status to called
    const updatedEntry = await prisma.governmentServiceQueue.update({
      where: { id: nextInQueue.id },
      data: {
        status: 'CALLED',
        notifiedAt: new Date()
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
      }
    });

    res.json({
      success: true,
      data: updatedEntry,
      message: 'Next person called successfully'
    });
  } catch (error) {
    console.error('Error calling next in queue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to call next person',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get current serving person (Admin only)
export const getCurrentlyServing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { serviceId } = req.params;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const currentlyServing = await prisma.governmentServiceQueue.findFirst({
      where: {
        serviceId,
        status: 'BEING_SERVED'
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
      }
    });

    res.json({
      success: true,
      data: currentlyServing
    });
  } catch (error) {
    console.error('Error getting currently serving:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get currently serving',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
