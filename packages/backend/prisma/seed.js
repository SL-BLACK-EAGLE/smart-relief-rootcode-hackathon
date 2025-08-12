const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing government services data
    console.log('Clearing existing government services data...');
    await prisma.governmentServiceAppointment.deleteMany();
    await prisma.governmentServiceQueue.deleteMany();
    await prisma.governmentServiceTimeSlot.deleteMany();
    await prisma.governmentService.deleteMany();
    await prisma.governmentOffice.deleteMany();

    // Create Government Offices
    console.log('Creating government offices...');
    const makatiOffice = await prisma.governmentOffice.create({
      data: {
        name: "Makati City Hall",
        code: "MCH-001",
        address: "J.P. Rizal Street, Poblacion, Makati City, Metro Manila 1200, Philippines",
        latitude: 14.5547,
        longitude: 121.0244,
        phone: "+63-2-8870-2444",
        email: "info@makati.gov.ph",
        website: "https://makati.gov.ph",
        operatingHours: {
          monday: { open: "08:00", close: "17:00" },
          tuesday: { open: "08:00", close: "17:00" },
          wednesday: { open: "08:00", close: "17:00" },
          thursday: { open: "08:00", close: "17:00" },
          friday: { open: "08:00", close: "17:00" },
          saturday: { open: "08:00", close: "12:00" },
          sunday: { open: null, close: null }
        },
        holidays: ["2024-01-01", "2024-12-25", "2024-12-30"],
        dailyCapacity: 150,
        staffCount: 12,
        servicesOffered: ["HEALTH", "DOCUMENTATION", "HOUSING"],
        isActive: true,
        temporarilyClosed: false
      }
    });

    const quezonOffice = await prisma.governmentOffice.create({
      data: {
        name: "Quezon City Hall",
        code: "QCH-001",
        address: "Elliptical Road, Diliman, Quezon City, Metro Manila 1100, Philippines",
        latitude: 14.6507,
        longitude: 121.0300,
        phone: "+63-2-8988-4242",
        email: "info@quezoncity.gov.ph",
        website: "https://quezoncity.gov.ph",
        operatingHours: {
          monday: { open: "08:00", close: "17:00" },
          tuesday: { open: "08:00", close: "17:00" },
          wednesday: { open: "08:00", close: "17:00" },
          thursday: { open: "08:00", close: "17:00" },
          friday: { open: "08:00", close: "17:00" },
          saturday: { open: "08:00", close: "12:00" },
          sunday: { open: null, close: null }
        },
        holidays: ["2024-01-01", "2024-12-25", "2024-12-30"],
        dailyCapacity: 120,
        staffCount: 10,
        servicesOffered: ["SOCIAL_WELFARE", "LICENSING"],
        isActive: true,
        temporarilyClosed: false
      }
    });

    console.log('Creating government services...');

    // 1. Health Certificate Service
    const healthCertificate = await prisma.governmentService.create({
      data: {
        name: "Health Certificate Application",
        description: "Apply for health certificates required for employment, travel, or other purposes",
        category: "HEALTHCARE",
        department: "Department of Health",
        isActive: true,
        requiresDocuments: true,
        avgProcessingTime: 60,
        cost: 200.00,
        allowsOnlineBooking: true,
        maxAdvanceBookingDays: 14,
        slotDuration: 30,
        bufferTime: 15,
        maxDailySlots: 50,
        requiredDocuments: [
          "Valid government-issued ID",
          "Filled application form",
          "2x2 ID photos (2 pieces)",
          "Medical examination fee"
        ],
        eligibilityCriteria: "Must be 18 years old or above",
        officeLocation: "Makati City Hall Health Department",
        contactInfo: {
          phone: "+63-2-8870-2555",
          email: "health@makati.gov.ph",
          website: "https://makati.gov.ph/health-services"
        }
      }
    });

    // 2. SSS Benefits Service
    const sssBenefits = await prisma.governmentService.create({
      data: {
        name: "SSS Benefits Application",
        description: "Apply for various SSS benefits including retirement, disability, and death benefits",
        category: "SOCIAL_WELFARE",
        department: "Social Security System",
        isActive: true,
        requiresDocuments: true,
        avgProcessingTime: 90,
        cost: 0.00,
        allowsOnlineBooking: true,
        maxAdvanceBookingDays: 21,
        slotDuration: 45,
        bufferTime: 15,
        maxDailySlots: 30,
        requiredDocuments: [
          "SSS ID or Member's Record",
          "Valid government-issued ID",
          "Supporting documents (varies by benefit type)",
          "Filled application form"
        ],
        eligibilityCriteria: "Must be an active SSS member",
        officeLocation: "Quezon City SSS Branch",
        contactInfo: {
          phone: "+63-2-8920-6401",
          email: "benefits@sss.gov.ph",
          website: "https://www.sss.gov.ph"
        }
      }
    });

    // 3. Passport Application Service
    const passportService = await prisma.governmentService.create({
      data: {
        name: "Passport Application & Renewal",
        description: "Apply for new passport or renew existing passport",
        category: "DOCUMENTATION",
        department: "Department of Foreign Affairs",
        isActive: true,
        requiresDocuments: true,
        avgProcessingTime: 120,
        cost: 950.00,
        allowsOnlineBooking: true,
        maxAdvanceBookingDays: 30,
        slotDuration: 60,
        bufferTime: 15,
        maxDailySlots: 100,
        requiredDocuments: [
          "Birth certificate (PSA issued)",
          "Valid government-issued ID",
          "Accomplished application form",
          "Passport photos (4.5cm x 3.5cm)"
        ],
        eligibilityCriteria: "Must be a Filipino citizen",
        officeLocation: "Makati DFA Consular Office",
        contactInfo: {
          phone: "+63-2-8234-3000",
          email: "passport@dfa.gov.ph",
          website: "https://www.passport.gov.ph"
        }
      }
    });

    // 4. Driver's License Service
    const driversLicense = await prisma.governmentService.create({
      data: {
        name: "Driver's License Application",
        description: "Apply for new driver's license or license renewal",
        category: "LICENSING",
        department: "Land Transportation Office",
        isActive: true,
        requiresDocuments: true,
        avgProcessingTime: 180,
        cost: 585.00,
        allowsOnlineBooking: true,
        maxAdvanceBookingDays: 7,
        slotDuration: 90,
        bufferTime: 30,
        maxDailySlots: 80,
        requiredDocuments: [
          "Valid government-issued ID",
          "Medical certificate",
          "Drug test results",
          "Accomplished application form",
          "2x2 ID photos (4 pieces)"
        ],
        eligibilityCriteria: "Must be at least 17 years old (18 for professional license)",
        officeLocation: "Quezon City LTO Office",
        contactInfo: {
          phone: "+63-2-8426-3293",
          email: "license@lto.gov.ph",
          website: "https://www.lto.gov.ph"
        }
      }
    });

    // 5. Housing Loan Service
    const housingLoan = await prisma.governmentService.create({
      data: {
        name: "Pag-IBIG Housing Loan Application",
        description: "Apply for affordable housing loans through Pag-IBIG Fund",
        category: "HOUSING",
        department: "Home Development Mutual Fund",
        isActive: true,
        requiresDocuments: true,
        avgProcessingTime: 60,
        cost: 0.00,
        allowsOnlineBooking: true,
        maxAdvanceBookingDays: 30,
        slotDuration: 45,
        bufferTime: 15,
        maxDailySlots: 25,
        requiredDocuments: [
          "Pag-IBIG Membership ID",
          "Valid government-issued ID",
          "Certificate of Employment and Compensation",
          "Income Tax Return (ITR)",
          "Bank statements (6 months)",
          "Property documents"
        ],
        eligibilityCriteria: "Must be an active Pag-IBIG member with at least 24 monthly contributions",
        officeLocation: "Makati Pag-IBIG Fund Office",
        contactInfo: {
          phone: "+63-2-8724-4244",
          email: "housing@pagibigfund.gov.ph",
          website: "https://www.pagibigfund.gov.ph"
        }
      }
    });

    console.log('Creating time slots for services...');

    // Create time slots for each service
    const services = [healthCertificate, sssBenefits, passportService, driversLicense, housingLoan];
    
    for (const service of services) {
      // Create time slots for Monday (1) to Friday (5)
      for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
        // Morning slots (8:00 AM - 12:00 PM)
        const morningSlots = [
          { start: "08:00", end: "09:00" },
          { start: "09:00", end: "10:00" },
          { start: "10:00", end: "11:00" },
          { start: "11:00", end: "12:00" }
        ];
        
        // Afternoon slots (1:00 PM - 5:00 PM)
        const afternoonSlots = [
          { start: "13:00", end: "14:00" },
          { start: "14:00", end: "15:00" },
          { start: "15:00", end: "16:00" },
          { start: "16:00", end: "17:00" }
        ];
        
        const allSlots = [...morningSlots, ...afternoonSlots];
        
        for (const slot of allSlots) {
          await prisma.governmentServiceTimeSlot.create({
            data: {
              serviceId: service.id,
              dayOfWeek: dayOfWeek,
              startTime: slot.start,
              endTime: slot.end,
              isActive: true,
              maxAppointments: Math.floor(service.maxDailySlots / allSlots.length),
              specialDates: null
            }
          });
        }
      }
      
      // Add Saturday slots for services that support it (passport service)
      if (service.name.includes("Passport")) {
        const saturdaySlots = [
          { start: "08:00", end: "09:00" },
          { start: "09:00", end: "10:00" },
          { start: "10:00", end: "11:00" },
          { start: "11:00", end: "12:00" }
        ];
        
        for (const slot of saturdaySlots) {
          await prisma.governmentServiceTimeSlot.create({
            data: {
              serviceId: service.id,
              dayOfWeek: 6, // Saturday
              startTime: slot.start,
              endTime: slot.end,
              isActive: true,
              maxAppointments: Math.floor(service.maxDailySlots / 8), // Fewer slots on Saturday
              specialDates: null
            }
          });
        }
      }
    }

    // Seed admin and sample user
    console.log('Seeding users...');
    const adminEmail = 'admin@smartrelief.test';
    const userEmail = 'user1@smartrelief.test';
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const userPassword = await bcrypt.hash('Passw0rd!', 10);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        email: userEmail,
        password: userPassword,
        role: 'VICTIM',
      },
    });

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created ${services.length} government services`);
    console.log(`Created 2 government offices`);
    console.log(`Created ${services.length * 8} time slots`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
