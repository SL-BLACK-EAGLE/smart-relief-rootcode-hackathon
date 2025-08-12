-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VICTIM', 'DONOR', 'VOLUNTEER', 'ORGANIZATION', 'ADMIN');

-- CreateEnum
CREATE TYPE "AidCategory" AS ENUM ('MEDICAL', 'FOOD', 'WATER', 'SHELTER', 'CLOTHING', 'TRANSPORTATION', 'COMMUNICATION', 'RESCUE', 'EVACUATION', 'OTHER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VolunteerStatus" AS ENUM ('AVAILABLE', 'BUSY', 'OFFLINE');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'EMERGENCY', 'SUCCESS');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('AVAILABLE', 'ALLOCATED', 'IN_TRANSIT', 'DELIVERED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GovernmentServiceCategory" AS ENUM ('HEALTHCARE', 'EDUCATION', 'SOCIAL_WELFARE', 'HOUSING', 'EMPLOYMENT', 'DOCUMENTATION', 'LICENSING', 'PERMITS', 'EMERGENCY_SERVICES', 'UTILITIES', 'TRANSPORTATION', 'LEGAL_AID', 'INSURANCE', 'DISABILITY_SERVICES', 'ELDERLY_CARE', 'OTHER');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED');

-- CreateEnum
CREATE TYPE "AppointmentPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "DocumentVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('WAITING', 'CALLED', 'BEING_SERVED', 'COMPLETED', 'LEFT_QUEUE', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "QueuePriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY', 'DISABLED', 'ELDERLY', 'PREGNANT');

-- CreateEnum
CREATE TYPE "EmergencyServiceType" AS ENUM ('MEDICAL_EMERGENCY', 'FIRE', 'POLICE', 'DISASTER_RELIEF', 'SEARCH_RESCUE', 'EVACUATION', 'SHELTER', 'FOOD_DISTRIBUTION', 'WATER_SUPPLY', 'POWER_RESTORATION', 'COMMUNICATION', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'LIFE_THREATENING');

-- CreateEnum
CREATE TYPE "EmergencyRequestStatus" AS ENUM ('SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESPONDED', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "bloodType" TEXT,
    "allergies" TEXT,
    "medicalInfo" TEXT,
    "skills" TEXT[],
    "availability" TEXT,
    "organizationName" TEXT,
    "organizationType" TEXT,
    "taxId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aid_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "AidCategory" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 5,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "images" TEXT[],
    "damageAssessment" JSONB,
    "estimatedCost" DOUBLE PRECISION,
    "urgencyScore" INTEGER,
    "estimatedFulfillmentTime" TIMESTAMP(3),
    "actualFulfillmentTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "aid_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "AidCategory" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "expiryDate" TIMESTAMP(3),
    "estimatedValue" DOUBLE PRECISION,
    "donorId" TEXT,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_allocations" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "aidRequestId" TEXT NOT NULL,
    "quantityAllocated" INTEGER NOT NULL,
    "status" "ResourceStatus" NOT NULL DEFAULT 'ALLOCATED',
    "allocatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "resource_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_tasks" (
    "id" TEXT NOT NULL,
    "aidRequestId" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'ASSIGNED',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completionPhotos" TEXT[],
    "completionNotes" TEXT,

    CONSTRAINT "volunteer_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "allocation" JSONB,
    "impactMetrics" JSONB,
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "receiptUrl" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringPeriod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "data" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "GovernmentServiceCategory" NOT NULL,
    "department" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresDocuments" BOOLEAN NOT NULL DEFAULT true,
    "avgProcessingTime" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION DEFAULT 0,
    "allowsOnlineBooking" BOOLEAN NOT NULL DEFAULT true,
    "maxAdvanceBookingDays" INTEGER NOT NULL DEFAULT 30,
    "slotDuration" INTEGER NOT NULL DEFAULT 30,
    "bufferTime" INTEGER NOT NULL DEFAULT 5,
    "maxDailySlots" INTEGER NOT NULL DEFAULT 50,
    "requiredDocuments" TEXT[],
    "eligibilityCriteria" TEXT,
    "officeLocation" TEXT NOT NULL,
    "contactInfo" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_service_time_slots" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxAppointments" INTEGER NOT NULL DEFAULT 10,
    "specialDates" JSONB,

    CONSTRAINT "government_service_time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_service_appointments" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 30,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "priority" "AppointmentPriority" NOT NULL DEFAULT 'NORMAL',
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingReference" TEXT NOT NULL,
    "queuePosition" INTEGER,
    "estimatedWaitTime" INTEGER,
    "documentsSubmitted" JSONB,
    "verificationStatus" "DocumentVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "remindersSent" INTEGER NOT NULL DEFAULT 0,
    "lastReminderAt" TIMESTAMP(3),
    "serviceCompletedAt" TIMESTAMP(3),
    "feedback" JSONB,
    "rating" INTEGER,
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_service_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_service_queue" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "estimatedWaitTime" INTEGER NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'WAITING',
    "priority" "QueuePriority" NOT NULL DEFAULT 'NORMAL',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),
    "servedAt" TIMESTAMP(3),
    "leftQueueAt" TIMESTAMP(3),
    "reason" TEXT,
    "notes" TEXT,

    CONSTRAINT "government_service_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "government_offices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "operatingHours" JSONB NOT NULL,
    "holidays" JSONB NOT NULL,
    "dailyCapacity" INTEGER NOT NULL DEFAULT 100,
    "staffCount" INTEGER NOT NULL DEFAULT 5,
    "servicesOffered" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "temporarilyClosed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "government_offices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_service_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceType" "EmergencyServiceType" NOT NULL,
    "urgencyLevel" "UrgencyLevel" NOT NULL DEFAULT 'HIGH',
    "description" TEXT NOT NULL,
    "peopleAffected" INTEGER,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "status" "EmergencyRequestStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignedOfficer" TEXT,
    "responseTime" INTEGER,
    "photos" TEXT[],
    "documents" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,
    "followUpNotes" TEXT,

    CONSTRAINT "emergency_service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "aid_requests_latitude_longitude_idx" ON "aid_requests"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "aid_requests_status_priority_idx" ON "aid_requests"("status", "priority");

-- CreateIndex
CREATE INDEX "aid_requests_category_status_idx" ON "aid_requests"("category", "status");

-- CreateIndex
CREATE INDEX "resources_category_status_idx" ON "resources"("category", "status");

-- CreateIndex
CREATE INDEX "resources_latitude_longitude_idx" ON "resources"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "volunteer_tasks_volunteerId_status_idx" ON "volunteer_tasks"("volunteerId", "status");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_timestamp_idx" ON "analytics_events"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "government_services_category_isActive_idx" ON "government_services"("category", "isActive");

-- CreateIndex
CREATE INDEX "government_services_department_idx" ON "government_services"("department");

-- CreateIndex
CREATE INDEX "government_service_time_slots_serviceId_dayOfWeek_idx" ON "government_service_time_slots"("serviceId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "government_service_appointments_bookingReference_key" ON "government_service_appointments"("bookingReference");

-- CreateIndex
CREATE INDEX "government_service_appointments_userId_status_idx" ON "government_service_appointments"("userId", "status");

-- CreateIndex
CREATE INDEX "government_service_appointments_serviceId_appointmentDate_idx" ON "government_service_appointments"("serviceId", "appointmentDate");

-- CreateIndex
CREATE INDEX "government_service_appointments_bookingReference_idx" ON "government_service_appointments"("bookingReference");

-- CreateIndex
CREATE INDEX "government_service_appointments_appointmentDate_status_idx" ON "government_service_appointments"("appointmentDate", "status");

-- CreateIndex
CREATE INDEX "government_service_queue_serviceId_position_idx" ON "government_service_queue"("serviceId", "position");

-- CreateIndex
CREATE INDEX "government_service_queue_userId_status_idx" ON "government_service_queue"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "government_offices_code_key" ON "government_offices"("code");

-- CreateIndex
CREATE INDEX "government_offices_latitude_longitude_idx" ON "government_offices"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "emergency_service_requests_userId_status_idx" ON "emergency_service_requests"("userId", "status");

-- CreateIndex
CREATE INDEX "emergency_service_requests_urgencyLevel_status_idx" ON "emergency_service_requests"("urgencyLevel", "status");

-- CreateIndex
CREATE INDEX "emergency_service_requests_latitude_longitude_idx" ON "emergency_service_requests"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "audit_logs_userId_timestamp_idx" ON "audit_logs"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aid_requests" ADD CONSTRAINT "aid_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_aidRequestId_fkey" FOREIGN KEY ("aidRequestId") REFERENCES "aid_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_allocations" ADD CONSTRAINT "resource_allocations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_tasks" ADD CONSTRAINT "volunteer_tasks_aidRequestId_fkey" FOREIGN KEY ("aidRequestId") REFERENCES "aid_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_tasks" ADD CONSTRAINT "volunteer_tasks_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government_service_time_slots" ADD CONSTRAINT "government_service_time_slots_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "government_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government_service_appointments" ADD CONSTRAINT "government_service_appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "government_services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government_service_appointments" ADD CONSTRAINT "government_service_appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_service_requests" ADD CONSTRAINT "emergency_service_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
