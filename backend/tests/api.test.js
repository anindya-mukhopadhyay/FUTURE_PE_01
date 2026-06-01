const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');
const Payment = require('../models/Payment');

// Mock all Mongoose database calls to make tests environment-independent, fast, and robust
jest.mock('../models/User');
jest.mock('../models/Trainer');
jest.mock('../models/Class');
jest.mock('../models/Payment');

describe('Newtown Fitness Gym API Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Endpoints', () => {
    it('should successfully register a member', async () => {
      const mockUserData = {
        fullName: 'Test User',
        email: 'test@gmail.com',
        mobileNumber: '9988776655',
        password: 'password123',
        gender: 'female',
        dateOfBirth: '1998-05-20'
      };

      // Mock user search to find nothing (no duplicates)
      User.findOne.mockResolvedValue(null);
      // Mock creation
      User.create.mockResolvedValue({
        _id: 'mockid123',
        fullName: mockUserData.fullName,
        email: mockUserData.email,
        role: 'member'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send(mockUserData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.fullName).toEqual('Test User');
      expect(res.body.token).toBeDefined();
    });

    it('should fail registration on duplicate email/mobile', async () => {
      User.findOne.mockResolvedValue({ _id: 'existingid' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'duplicate@gmail.com',
          mobileNumber: '9988776655',
          password: 'password'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('User already exists');
    });

    it('should successfully log in with email/mobile credentials', async () => {
      const mockUserInstance = {
        _id: 'mockuser123',
        fullName: 'Jane Doe',
        email: 'jane@gmail.com',
        role: 'member',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockResolvedValue(mockUserInstance);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          loginCredential: 'jane@gmail.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.fullName).toEqual('Jane Doe');
    });
  });

  describe('Public Catalog Endpoints', () => {
    it('should return all trainers profiles', async () => {
      Trainer.find.mockResolvedValue([
        { name: 'Trainer 1', specialization: ['Yoga'] },
        { name: 'Trainer 2', specialization: ['HIIT'] }
      ]);

      const res = await request(app).get('/api/trainers');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toEqual(2);
      expect(res.body.data[0].name).toEqual('Trainer 1');
    });

    it('should return all group classes schedules', async () => {
      const mockClassQuery = {
        populate: jest.fn().mockResolvedValue([
          { title: 'CrossFit', capacity: 20, timeSlot: '09:00 - 10:00' },
          { title: 'Zumba', capacity: 30, timeSlot: '17:00 - 18:00' }
        ])
      };
      Class.find.mockReturnValue(mockClassQuery);

      const res = await request(app).get('/api/classes');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toEqual(2);
      expect(res.body.data[0].title).toEqual('CrossFit');
    });
  });
});
