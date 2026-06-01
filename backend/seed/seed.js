const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const Offer = require('../models/Offer');
const GalleryItem = require('../models/GalleryItem');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const ContactQuery = require('../models/ContactQuery');
const Payment = require('../models/Payment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newtown_fitness');
    console.log('MongoDB Connected for seeding...');

    // Clear all existing data
    await User.deleteMany();
    await Trainer.deleteMany();
    await Class.deleteMany();
    await Offer.deleteMany();
    await GalleryItem.deleteMany();
    await NewsletterSubscriber.deleteMany();
    await ContactQuery.deleteMany();
    await Payment.deleteMany();
    console.log('All existing collections cleared.');

    // 1. Create Admins, Trainers, and Members accounts
    console.log('Seeding Users...');
    const adminUser = await User.create({
      fullName: 'Newtown Admin',
      email: 'admin@newtownfitness.com',
      mobileNumber: '9999999999',
      password: 'adminpassword',
      gender: 'male',
      dateOfBirth: new Date('1985-05-15'),
      role: 'admin'
    });

    const trainerUser = await User.create({
      fullName: 'Vikram Rathore',
      email: 'vikram@newtownfitness.com',
      mobileNumber: '8888888888',
      password: 'trainerpassword',
      gender: 'male',
      dateOfBirth: new Date('1990-08-20'),
      role: 'trainer'
    });

    const memberUser = await User.create({
      fullName: 'John Doe',
      email: 'member@gmail.com',
      mobileNumber: '7777777777',
      password: 'memberpassword',
      gender: 'male',
      dateOfBirth: new Date('1995-10-10'),
      role: 'member',
      membership: {
        status: 'active',
        planType: 'Quarterly Package',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-08-01'),
        lastPaymentId: 'pay_mock123abc'
      },
      metrics: {
        weightLogs: [
          { date: new Date('2026-01-01'), weight: 88 },
          { date: new Date('2026-02-01'), weight: 86.5 },
          { date: new Date('2026-03-01'), weight: 84.8 },
          { date: new Date('2026-04-01'), weight: 83.2 },
          { date: new Date('2026-05-01'), weight: 81.5 }
        ],
        targetWeight: 75,
        height: 180
      },
      attendance: [
        new Date('2026-05-25T08:00:00Z'),
        new Date('2026-05-26T08:00:00Z'),
        new Date('2026-05-28T08:00:00Z'),
        new Date('2026-05-29T08:00:00Z'),
        new Date('2026-05-31T08:00:00Z')
      ]
    });

    console.log('Seeding Trainers...');
    // 2. Create Trainer profiles
    const trainerProfiles = await Trainer.insertMany([
      {
        name: 'Vikram Rathore',
        imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop',
        specialization: ['Bodybuilding', 'Strength & Conditioning', 'Powerlifting'],
        experience: 8,
        certifications: ['ISSA Certified Trainer', 'NSCA CSCS', 'First Aid / CPR'],
        email: 'vikram@newtownfitness.com',
        phone: '8888888888',
        schedule: ['07:00 - 08:00', '09:00 - 10:00', '18:00 - 19:00'],
        bio: 'Vikram specializes in body re-composition and strength coaching, helping professionals build long-lasting habits.'
      },
      {
        name: 'Sarah Jenkins',
        imageUrl: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=400&auto=format&fit=crop',
        specialization: ['Zumba', 'Aerobics', 'Cardio Fitness', 'Pilates'],
        experience: 6,
        certifications: ['ZIN Certified Zumba Instructor', 'ACE Personal Trainer', 'Pilates Method Alliance'],
        email: 'sarah@newtownfitness.com',
        phone: '8888888881',
        schedule: ['08:00 - 09:00', '10:00 - 11:00', '17:00 - 18:00'],
        bio: 'Sarah combines dynamic dance with body movements for an electrifying cardio environment that burns calories.'
      },
      {
        name: 'Rajesh Sharma',
        imageUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop',
        specialization: ['Yoga & Mindfulness', 'Flexibility Training', 'Physical Rehabilitation'],
        experience: 12,
        certifications: ['RYT-500 Certified Yoga Master', 'Master in Yoga Studies', 'NASM Corrective Exercise Specialist'],
        email: 'rajesh@newtownfitness.com',
        phone: '8888888882',
        schedule: ['06:00 - 07:00', '08:00 - 09:00', '16:00 - 17:00'],
        bio: 'Rajesh brings an integrated approach linking spiritual balance with core flexibility and kinetic stability.'
      },
      {
        name: 'David Vance',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop',
        specialization: ['CrossFit Coach', 'HIIT Specialist', 'Functional Strength'],
        experience: 5,
        certifications: ['CrossFit Level 2 Coach', 'Olympic Weightlifting Cert', 'CPR/AED'],
        email: 'david@newtownfitness.com',
        phone: '8888888883',
        schedule: ['09:00 - 10:00', '11:00 - 12:00', '19:00 - 20:00'],
        bio: 'David leads intense CrossFit and functional programs, preparing athletes to unlock real physical peaks.'
      }
    ]);

    console.log('Seeding Classes...');
    // 3. Create Gym Classes
    const class1 = await Class.create({
      title: 'HIIT Burnout',
      description: 'High-intensity interval training designed to push your aerobic limit and burn maximum fat.',
      trainer: trainerProfiles[3]._id, // David Vance
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlot: '09:00 - 10:00',
      capacity: 15,
      enrolledMembers: [memberUser._id],
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
    });

    const class2 = await Class.create({
      title: 'Power CrossFit',
      description: 'Combine weightlifting, gymnastics, and high-intensity metabolic conditioning in a fast-paced circuit.',
      trainer: trainerProfiles[3]._id, // David Vance
      scheduleDays: ['Tuesday', 'Thursday', 'Saturday'],
      timeSlot: '19:00 - 20:00',
      capacity: 20,
      enrolledMembers: [],
      imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop'
    });

    const class3 = await Class.create({
      title: 'Morning Vinyasa Yoga',
      description: 'Find physical balance, flexible core strength, and spiritual clarity through focused breath flows.',
      trainer: trainerProfiles[2]._id, // Rajesh Sharma
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlot: '06:00 - 07:00',
      capacity: 25,
      enrolledMembers: [memberUser._id],
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop'
    });

    const class4 = await Class.create({
      title: 'Hypertrophy Powerbuilding',
      description: 'Focus on progressive overload compound lifts combined with targeted accessory volume to build size.',
      trainer: trainerProfiles[0]._id, // Vikram Rathore
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      timeSlot: '18:00 - 19:00',
      capacity: 12,
      enrolledMembers: [],
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop'
    });

    const class5 = await Class.create({
      title: 'Zumba Fiesta',
      description: 'Electrifying Latin dance moves mixed with bodyweight exercises for a fun, high-energy cardio session.',
      trainer: trainerProfiles[1]._id, // Sarah Jenkins
      scheduleDays: ['Tuesday', 'Thursday'],
      timeSlot: '17:00 - 18:00',
      capacity: 30,
      enrolledMembers: [],
      imageUrl: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop'
    });

    console.log('Seeding Offers...');
    // 4. Create Active Offers
    await Offer.insertMany([
      {
        title: 'Newtown Gym Grand Opening Special',
        code: 'NEWTOWN25',
        discount: 25,
        description: 'Get an absolute 25% discount off any of our premium membership plans. Excludes personal training.',
        validUntil: new Date('2026-12-31')
      },
      {
        title: 'Monsoon Fitness Festival Discount',
        code: 'MONSOON15',
        discount: 15,
        description: 'Prepare your beach body indoors. Grab 15% discounts across our half-yearly and yearly plans.',
        validUntil: new Date('2026-08-31')
      },
      {
        title: 'Double Referral Double Gains',
        code: 'REFER30',
        discount: 30,
        description: 'Invite your lifting buddy and both get 30% off your next renewals. Apply code at checkout.',
        validUntil: new Date('2026-10-15')
      }
    ]);

    console.log('Seeding Gallery...');
    // 5. Create Gallery Items
    await GalleryItem.insertMany([
      {
        title: 'Our Massive Weight Lifting Floor',
        imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
        category: 'Facilities',
        type: 'photo'
      },
      {
        title: 'Premium Cardio Rows & Treadmills',
        imageUrl: 'https://images.unsplash.com/photo-1571731956622-9a642941b3f5?q=80&w=800&auto=format&fit=crop',
        category: 'Facilities',
        type: 'photo'
      },
      {
        title: 'Intense Group CrossFit Challenge',
        imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
        category: 'Workouts',
        type: 'photo'
      },
      {
        title: 'Sarah Jenkins Leading Zumba Session',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
        category: 'Events',
        type: 'photo'
      },
      {
        title: 'Member Marcus 12-Week Transformation',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop',
        category: 'Transformations',
        type: 'photo'
      },
      {
        title: 'Elena Core Abs Transformation',
        imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
        category: 'Transformations',
        type: 'photo'
      }
    ]);

    console.log('Seeding Newsletter...');
    // 6. Create Newsletter Subscribers
    await NewsletterSubscriber.insertMany([
      { email: 'clara@gmail.com' },
      { email: 'marcus.v@yahoo.com' },
      { email: 'robert.lifting@outlook.com' }
    ]);

    console.log('Seeding Queries...');
    // 7. Create Contact Queries
    await ContactQuery.insertMany([
      {
        name: 'Clara Oswald',
        email: 'clara@gmail.com',
        mobile: '9876543210',
        subject: 'Corporate Membership Discount Schemes',
        message: 'Hello, we are a software firm with 45 local staff. Do you run customized corporate rate schemes for group gym memberships?',
        status: 'pending'
      },
      {
        name: 'Mark Miller',
        email: 'mark@yahoo.com',
        mobile: '9876543211',
        subject: 'Opening Hours on Holidays',
        message: 'Is Newtown gym open during national festival holidays, or do opening schedules vary on Sundays?',
        status: 'resolved',
        adminResponse: 'Yes Mark! Newtown Gym is operational 365 days a year from 06:00 to 22:00. On major holidays we operate on shortened Sunday hours (08:00 to 18:00).'
      }
    ]);

    console.log('Seeding Payments (Analytics data)...');
    // 8. Create Payment history
    await Payment.insertMany([
      {
        member: memberUser._id,
        planType: 'Quarterly Package',
        amount: 8500,
        paymentId: 'pay_mock123abc',
        status: 'success',
        invoiceNumber: 'NTF-INV-20260501-1002',
        purchaseDate: new Date('2026-05-01'),
        expiryDate: new Date('2026-08-01'),
        paymentMethod: 'UPI'
      },
      {
        member: memberUser._id,
        planType: 'Monthly Package',
        amount: 3200,
        paymentId: 'pay_mock456xyz',
        status: 'success',
        invoiceNumber: 'NTF-INV-20260401-1001',
        purchaseDate: new Date('2026-04-01'),
        expiryDate: new Date('2026-05-01'),
        paymentMethod: 'Credit Card'
      }
    ]);

    console.log('Database Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
