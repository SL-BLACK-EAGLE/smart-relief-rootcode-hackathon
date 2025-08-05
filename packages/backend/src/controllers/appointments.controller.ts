import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  BookAppointmentRequest,
  RescheduleAppointmentRequest,
  AppointmentSearchParams
} from '../../../shared/src/types/government-services.types';
import { AuthenticatedRequest } from '../types/express.types';

const prisma = new PrismaClient();

// Generate booking reference
const generateBookingReference = (): string => {
  const prefix = 'GOV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Book a new appointment
export const bookAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming auth middleware sets req.user
    const appointmentData: BookAppointmentRequest = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate service exists and is active
    const service = await prisma.governmentService.findFirst({
      where: {
        id: appointmentData.serviceId,
        isActive: true,
        allowsOnlineBooking: true
      },
      include: {
        timeSlots: {
          where: { isActive: true }
        }
      }
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or booking not available'
      });
    }

    const appointmentDateTime = new Date(`${appointmentData.appointmentDate}T${appointmentData.timeSlot}`);
    const dayOfWeek = appointmentDateTime.getDay();

    // Check if the time slot is valid for this service
    const validTimeSlot = service.timeSlots.find(
      slot => slot.dayOfWeek === dayOfWeek && slot.startTime === appointmentData.timeSlot
    );

    if (!validTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot for this service'
      });
    }

    // Check if slot is available
    const existingAppointments = await prisma.governmentServiceAppointment.count({
      where: {
        serviceId: appointmentData.serviceId,
        appointmentDate: {
          gte: new Date(`${appointmentData.appointmentDate}T00:00:00`),
          lt: new Date(`${appointmentData.appointmentDate}T23:59:59`)
        },
        timeSlot: appointmentData.timeSlot,
        status: { in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'] }
      }
    });

    if (existingAppointments >= validTimeSlot.maxAppointments) {
      return res.status(400).json({
        success: false,
        message: 'No slots available for the selected time'
      });
    }

    // Check advance booking limit
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setDate(maxAdvanceDate.getDate() + service.maxAdvanceBookingDays);
    
    if (appointmentDateTime > maxAdvanceDate) {
      return res.status(400).json({
        success: false,
        message: `Cannot book more than ${service.maxAdvanceBookingDays} days in advance`
      });
    }

    // Check if user already has an appointment for this service on the same day
    const existingUserAppointment = await prisma.governmentServiceAppointment.findFirst({
      where: {
        userId,
        serviceId: appointmentData.serviceId,
        appointmentDate: {
          gte: new Date(`${appointmentData.appointmentDate}T00:00:00`),
          lt: new Date(`${appointmentData.appointmentDate}T23:59:59`)
        },
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
      }
    });

    if (existingUserAppointment) {
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment for this service on this date'
      });
    }

    // Create the appointment
    const bookingReference = generateBookingReference();
    const queuePosition = existingAppointments + 1;

    const appointment = await prisma.governmentServiceAppointment.create({
      data: {
        serviceId: appointmentData.serviceId,
        userId,
        appointmentDate: appointmentDateTime,
        timeSlot: appointmentData.timeSlot,
        duration: service.slotDuration,
        priority: appointmentData.priority || 'NORMAL',
        bookingReference,
        queuePosition,
        estimatedWaitTime: service.avgProcessingTime,
        documentsSubmitted: appointmentData.documentsSubmitted || {},
        notes: appointmentData.notes
      },
      include: {
        service: {
          select: {
            name: true,
            department: true,
            officeLocation: true,
            contactInfo: true
          }
        },
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

    res.status(201).json({
      success: true,
      data: {
        appointment,
        bookingReference,
        estimatedWaitTime: service.avgProcessingTime,
        queuePosition
      },
      message: 'Appointment booked successfully'
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user appointments
export const getUserAppointments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, startDate, endDate, serviceId } = req.query;

    // Authorization check - users can only see their own appointments unless admin
    if (req.user?.id !== userId && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) {
        where.appointmentDate.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.appointmentDate.lte = new Date(endDate as string);
      }
    }

    const appointments = await prisma.governmentServiceAppointment.findMany({
      where,
      include: {
        service: {
          select: {
            name: true,
            description: true,
            department: true,
            officeLocation: true,
            contactInfo: true,
            category: true
          }
        }
      },
      orderBy: { appointmentDate: 'asc' }
    });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            name: true,
            description: true,
            department: true,
            officeLocation: true,
            contactInfo: true,
            category: true,
            requiredDocuments: true
          }
        },
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

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Authorization check
    if (appointment.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Reschedule appointment
export const rescheduleAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const rescheduleData: RescheduleAppointmentRequest = req.body;

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id },
      include: { service: true }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Authorization check
    if (appointment.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment can be rescheduled
    if (!['SCHEDULED', 'CONFIRMED'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be rescheduled'
      });
    }

    const newDateTime = new Date(`${rescheduleData.newDate}T${rescheduleData.newTimeSlot}`);
    const dayOfWeek = newDateTime.getDay();

    // Validate new time slot
    const validTimeSlot = await prisma.governmentServiceTimeSlot.findFirst({
      where: {
        serviceId: appointment.serviceId,
        dayOfWeek,
        startTime: rescheduleData.newTimeSlot,
        isActive: true
      }
    });

    if (!validTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot'
      });
    }

    // Check availability for new slot
    const existingAppointments = await prisma.governmentServiceAppointment.count({
      where: {
        serviceId: appointment.serviceId,
        appointmentDate: {
          gte: new Date(`${rescheduleData.newDate}T00:00:00`),
          lt: new Date(`${rescheduleData.newDate}T23:59:59`)
        },
        timeSlot: rescheduleData.newTimeSlot,
        status: { in: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN'] },
        id: { not: id } // Exclude current appointment
      }
    });

    if (existingAppointments >= validTimeSlot.maxAppointments) {
      return res.status(400).json({
        success: false,
        message: 'No slots available for the selected time'
      });
    }

    // Update appointment
    const updatedAppointment = await prisma.governmentServiceAppointment.update({
      where: { id },
      data: {
        appointmentDate: newDateTime,
        timeSlot: rescheduleData.newTimeSlot,
        status: 'RESCHEDULED',
        queuePosition: existingAppointments + 1,
        notes: rescheduleData.reason 
          ? `${appointment.notes || ''}\nRescheduled: ${rescheduleData.reason}`.trim()
          : appointment.notes
      },
      include: {
        service: {
          select: {
            name: true,
            department: true,
            officeLocation: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment rescheduled successfully'
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Cancel appointment
export const cancelAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Authorization check
    if (appointment.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment can be cancelled
    if (!['SCHEDULED', 'CONFIRMED', 'RESCHEDULED'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Appointment cannot be cancelled'
      });
    }

    const updatedAppointment = await prisma.governmentServiceAppointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason 
          ? `${appointment.notes || ''}\nCancelled: ${reason}`.trim()
          : appointment.notes
      }
    });

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Check in for appointment
export const checkInAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id },
      include: { service: true }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if appointment is today and within check-in window
    const today = new Date().toISOString().split('T')[0];
    const appointmentDate = appointment.appointmentDate.toISOString().split('T')[0];

    if (appointmentDate !== today) {
      return res.status(400).json({
        success: false,
        message: 'Can only check in on the appointment date'
      });
    }

    if (appointment.status !== 'CONFIRMED' && appointment.status !== 'SCHEDULED') {
      return res.status(400).json({
        success: false,
        message: 'Invalid appointment status for check-in'
      });
    }

    const updatedAppointment = await prisma.governmentServiceAppointment.update({
      where: { id },
      data: {
        status: 'CHECKED_IN'
      }
    });

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Checked in successfully'
    });
  } catch (error) {
    console.error('Error checking in appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Complete appointment (Admin only)
export const completeAppointment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status !== 'CHECKED_IN' && appointment.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: 'Appointment must be checked in or in progress to complete'
      });
    }

    const updatedAppointment = await prisma.governmentServiceAppointment.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        serviceCompletedAt: new Date(),
        adminNotes: notes
      }
    });

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Appointment completed successfully'
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete appointment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Submit feedback for appointment
export const submitAppointmentFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, serviceQuality, waitTime, staffHelpfulness } = req.body;

    const appointment = await prisma.governmentServiceAppointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Authorization check
    if (appointment.userId !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for completed appointments'
      });
    }

    const feedback = {
      rating: rating || 5,
      comment,
      serviceQuality: serviceQuality || 5,
      waitTime: waitTime || 5,
      staffHelpfulness: staffHelpfulness || 5,
      submittedAt: new Date()
    };

    const updatedAppointment = await prisma.governmentServiceAppointment.update({
      where: { id },
      data: {
        feedback
      }
    });

    res.json({
      success: true,
      data: updatedAppointment,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
