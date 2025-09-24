
const transactionController = require('../src/controllers/transaction.controller.js');
const Transaction = require('../src/models/transaction.model.js');

jest.mock('../src/models/transaction.model.js');

describe('Transaction Controller', () => {
  describe('getTransactions', () => {
    it('should return all transactions', async () => {
      const mockTransactions = [
        { description: 'Salary', amount: 5000 },
        { description: 'Rent', amount: -1500 },
      ];
      Transaction.find.mockResolvedValue(mockTransactions);

      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await transactionController.getTransactions(req, res);

      expect(res.json).toHaveBeenCalledWith(mockTransactions);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error getting transactions' };
        Transaction.find.mockRejectedValue(errorMessage);

        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await transactionController.getTransactions(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage.message });
    });
  });
});
