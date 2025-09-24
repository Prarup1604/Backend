
const userController = require('../src/controllers/user.controller.js');
const User = require('../src/models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../src/models/user.model.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { username: 'user1', name: 'User One', email: 'user1@example.com' },
        { username: 'user2', name: 'User Two', email: 'user2@example.com' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await userController.getUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error getting users' };
        User.find.mockRejectedValue(errorMessage);

        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await userController.getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage.message });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('testtoken');

      const save = jest.fn();
      User.prototype.save = save;


      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should not register a user with an existing email', async () => {
      const req = {
        body: {
          username: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await userController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User with this email already exists.' });
    });
  });

  describe('login', () => {
    it('should login an existing user', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUser = {
        _id: 'testid',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('testtoken');

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should not login a user that does not exist', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findOne.mockResolvedValue(null);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User doesn't exist." });
    });

    it('should not login a user with an incorrect password', async () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'password123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockUser = {
        _id: 'testid',
        email: 'test@example.com',
        password: 'hashedpassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await userController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials.' });
    });
  });
});
