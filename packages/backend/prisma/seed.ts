import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding government services data...');

  // Create government services
  const healthcareService = await prisma.governmentService.create({
    data: {
      name: 'Health Certificate Application',
      description: 'Apply for health certificates for employment, travel, or legal purposes',
      category: 'HEALTHCARE',
      department: 'Department of Health',
      requiresDocuments: true,
      avgProcessingTime: 45,
      cost: 150.00,
      allowsOnlineBooking: true,
      maxAdvanceBookingDays: 30,
      slotDuration: 30,
      bufferTime: 5,
      maxDailySlots: 40,
      requiredDocuments: ['Valid ID', 'Medical Records', 'Application Form'],
      eligibilityCriteria: 'All citizens and residents',
      officeLocation: 'DOH Regional Office, Quezon City',
      contactInfo: {
        phone: '+63 2 8651 7800',
        email: 'healthcertificate@doh.gov.ph',
        website: 'https://doh.gov.ph',
        address: 'San Lazaro Compound, Rizal Avenue, Sta. Cruz, Manila'
      },
      timeSlots: {
        create: [
          {
            dayOfWeek: 1, // Monday
            startTime: '08:00',
            endTime: '12:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 1, // Monday
            startTime: '13:00',
            endTime: '17:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 2, // Tuesday
            startTime: '08:00',
            endTime: '12:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 2, // Tuesday
            startTime: '13:00',
            endTime: '17:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 3, // Wednesday
            startTime: '08:00',
            endTime: '12:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 3, // Wednesday
            startTime: '13:00',
            endTime: '17:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 4, // Thursday
            startTime: '08:00',
            endTime: '12:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 4, // Thursday
            startTime: '13:00',
            endTime: '17:00',
            isActive: true,
            maxAppointments: 8
          },
          {
            dayOfWeek: 5, // Friday
            startTime: '08:00',
            endTime: '12:00',
            isActive: true,
            maxAppointments: 8
          }
        ]
      }
    }
  });

  const socialWelfareService = await prisma.governmentService.create({
    data: {
      name: 'Social Security Benefits Application',
      description: 'Apply for SSS benefits including retirement, disability, and death benefits',
      category: 'SOCIAL_WELFARE',
      department: 'Social Security System',
      requiresDocuments: true,
      avgProcessingTime: 60,
      cost: 0.00,
      allowsOnlineBooking: true,
      maxAdvanceBookingDays: 45,
      slotDuration: 45,
      bufferTime: 10,
      maxDailySlots: 30,
      requiredDocuments: ['SSS ID', 'Birth Certificate', 'Employment Records', 'Medical Certificate (if applicable)'],
      eligibilityCriteria: 'SSS members with qualifying contributions',
      officeLocation: 'SSS Main Office, East Avenue, Quezon City',
      contactInfo: {
        phone: '+63 2 8922 1020',
        email: 'benefits@sss.gov.ph',
        website: 'https://sss.gov.ph',
        address: 'East Avenue, Diliman, Quezon City'
      },
      timeSlots: {
        create: [
          {
            dayOfWeek: 1,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 6
          },
          {
            dayOfWeek: 2,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 6
          },
          {
            dayOfWeek: 3,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 6
          },
          {
            dayOfWeek: 4,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 6
          },
          {
            dayOfWeek: 5,
            startTime: '08:00',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 6
          }
        ]
      }
    }
  });

  const documentationService = await prisma.governmentService.create({
    data: {
      name: 'Passport Application',
      description: 'Apply for new passport or passport renewal',
      category: 'DOCUMENTATION',
      department: 'Department of Foreign Affairs',
      requiresDocuments: true,
      avgProcessingTime: 30,
      cost: 950.00,
      allowsOnlineBooking: true,
      maxAdvanceBookingDays: 60,
      slotDuration: 20,
      bufferTime: 5,
      maxDailySlots: 60,
      requiredDocuments: ['Birth Certificate (PSA)', 'Valid ID', 'Accomplished Application Form', 'Passport Photos'],
      eligibilityCriteria: 'Filipino citizens',
      officeLocation: 'DFA Consular Office, Manila',
      contactInfo: {
        phone: '+63 2 8834 4000',
        email: 'passport@dfa.gov.ph',
        website: 'https://consular.dfa.gov.ph',
        address: '2330 Roxas Boulevard, Pasay City'
      },
      timeSlots: {
        create: [
          {
            dayOfWeek: 1,
            startTime: '07:30',
            endTime: '15:00',
            isActive: true,
            maxAppointments: 12
          },
          {
            dayOfWeek: 2,
            startTime: '07:30',
            endTime: '15:00',
            isActive: true,
            maxAppointments: 12
          },
          {
            dayOfWeek: 3,
            startTime: '07:30',
            endTime: '15:00',
            isActive: true,
            maxAppointments: 12
          },
          {
            dayOfWeek: 4,
            startTime: '07:30',
            endTime: '15:00',
            isActive: true,
            maxAppointments: 12
          },
          {
            dayOfWeek: 5,
            startTime: '07:30',
            endTime: '15:00',
            isActive: true,
            maxAppointments: 12
          },
          {
            dayOfWeek: 6,
            startTime: '08:00',
            endTime: '14:00',
            isActive: true,
            maxAppointments: 10
          }
        ]
      }
    }
  });

  const licensingService = await prisma.governmentService.create({
    data: {
      name: 'Driver\'s License Application',
      description: 'Apply for new driver\'s license or license renewal',
      category: 'LICENSING',
      department: 'Land Transportation Office',
      requiresDocuments: true,
      avgProcessingTime: 40,
      cost: 585.00,
      allowsOnlineBooking: true,
      maxAdvanceBookingDays: 30,
      slotDuration: 30,
      bufferTime: 5,
      maxDailySlots: 50,
      requiredDocuments: ['Birth Certificate', 'Valid ID', 'Medical Certificate', 'Drug Test Result'],
      eligibilityCriteria: 'Must be at least 17 years old',
      officeLocation: 'LTO Central Office, East Avenue, Quezon City',
      contactInfo: {
        phone: '+63 2 8927 8810',
        email: 'license@lto.gov.ph',
        website: 'https://lto.gov.ph',
        address: 'East Avenue, Diliman, Quezon City'
      },
      timeSlots: {
        create: [
          {
            dayOfWeek: 1,
            startTime: '08:00',
            endTime: '16:30',
            isActive: true,
            maxAppointments: 10
          },
          {
            dayOfWeek: 2,
            startTime: '08:00',
            endTime: '16:30',
            isActive: true,
            maxAppointments: 10
          },
          {
            dayOfWeek: 3,
            startTime: '08:00',
            endTime: '16:30',
            isActive: true,
            maxAppointments: 10
          },
          {
            dayOfWeek: 4,
            startTime: '08:00',
            endTime: '16:30',
            isActive: true,
            maxAppointments: 10
          },
          {
            dayOfWeek: 5,
            startTime: '08:00',
            endTime: '16:30',
            isActive: true,
            maxAppointments: 10
          }
        ]
      }
    }
  });

  const housingService = await prisma.governmentService.create({
    data: {
      name: 'Housing Loan Application',
      description: 'Apply for Pag-IBIG housing loans for home purchase or construction',
      category: 'HOUSING',
      department: 'Pag-IBIG Fund',
      requiresDocuments: true,
      avgProcessingTime: 90,
      cost: 0.00,
      allowsOnlineBooking: true,
      maxAdvanceBookingDays: 60,
      slotDuration: 60,
      bufferTime: 15,
      maxDailySlots: 20,
      requiredDocuments: ['Pag-IBIG ID', 'Income Documents', 'Property Documents', 'Bank Statements'],
      eligibilityCriteria: 'Active Pag-IBIG members with sufficient contributions',
      officeLocation: 'Pag-IBIG Head Office, Mandaluyong City',
      contactInfo: {
        phone: '+63 2 7724 4244',
        email: 'housing@pagibigfund.gov.ph',
        website: 'https://pagibigfund.gov.ph',
        address: 'The Juliana, Ortigas Center, Pasig City'
      },
      timeSlots: {
        create: [
          {
            dayOfWeek: 1,
            startTime: '08:30',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 4
          },
          {
            dayOfWeek: 2,
            startTime: '08:30',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 4
          },
          {
            dayOfWeek: 3,
            startTime: '08:30',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 4
          },
          {
            dayOfWeek: 4,
            startTime: '08:30',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 4
          },
          {
            dayOfWeek: 5,
            startTime: '08:30',
            endTime: '16:00',
            isActive: true,
            maxAppointments: 4
          }
        ]
      }
    }
  });

  // Create government offices
  const dohOffice = await prisma.governmentOffice.create({
    data: {
      name: 'DOH Regional Office - Metro Manila',
      code: 'DOH-NCR-001',
      address: 'San Lazaro Compound, Rizal Avenue, Sta. Cruz, Manila',
      latitude: 14.6142,
      longitude: 120.9817,
      phone: '+63 2 8651 7800',
      email: 'ncrro@doh.gov.ph',
      website: 'https://ro4a.doh.gov.ph',
      operatingHours: {
        'monday': { open: '08:00', close: '17:00', isOpen: true },
        'tuesday': { open: '08:00', close: '17:00', isOpen: true },
        'wednesday': { open: '08:00', close: '17:00', isOpen: true },
        'thursday': { open: '08:00', close: '17:00', isOpen: true },
        'friday': { open: '08:00', close: '17:00', isOpen: true },
        'saturday': { open: '00:00', close: '00:00', isOpen: false },
        'sunday': { open: '00:00', close: '00:00', isOpen: false }
      },
      holidays: [],
      dailyCapacity: 100,
      staffCount: 15,
      servicesOffered: [healthcareService.id],
      isActive: true,
      temporarilyClosed: false
    }
  });

  const sssOffice = await prisma.governmentOffice.create({
    data: {
      name: 'SSS Main Office',
      code: 'SSS-NCR-001',
      address: 'East Avenue, Diliman, Quezon City',
      latitude: 14.6507,
      longitude: 121.0470,
      phone: '+63 2 8922 1020',
      email: 'member_services@sss.gov.ph',
      website: 'https://sss.gov.ph',
      operatingHours: {
        'monday': { open: '08:00', close: '16:00', isOpen: true },
        'tuesday': { open: '08:00', close: '16:00', isOpen: true },
        'wednesday': { open: '08:00', close: '16:00', isOpen: true },
        'thursday': { open: '08:00', close: '16:00', isOpen: true },
        'friday': { open: '08:00', close: '16:00', isOpen: true },
        'saturday': { open: '00:00', close: '00:00', isOpen: false },
        'sunday': { open: '00:00', close: '00:00', isOpen: false }
      },
      holidays: [],
      dailyCapacity: 150,
      staffCount: 25,
      servicesOffered: [socialWelfareService.id],
      isActive: true,
      temporarilyClosed: false
    }
  });

  console.log('✅ Seeded government services data successfully!');
  console.log(`Created ${await prisma.governmentService.count()} government services`);
  console.log(`Created ${await prisma.governmentOffice.count()} government offices`);
  console.log(`Created ${await prisma.governmentServiceTimeSlot.count()} time slots`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
