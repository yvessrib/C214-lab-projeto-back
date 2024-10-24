import { db } from '../src/db'; 
import { transactions, projections } from '../src/db/schema';
import { DeleteTransaction } from '../src/functions/delete-transaction';

jest.mock('../src/db');

describe('deleteTransaction', () => {
  it('should delete a transaction, update projections, and return a success message', async () => {

    const mockTransactionId = '12345';
    const mockTransaction = {
      id: mockTransactionId,
      createdAt: new Date('2024-05-15T00:00:00Z'),
      type: 'income',
      value: 500,
    };
    const mockProjection = {
      year: 2024,
      month: 5,
      actualIncome: 1000,
      actualOutcome: 200,
    };

    // Mock transaction query
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([mockTransaction]),
      }),
    });

    // Mock delete query
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockResolvedValueOnce({}),
    });

    // Mock projections query
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([mockProjection]),
      }),
    });

    // Mock actual income/outcome queries
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([{ value: 800 }]),
      }),
    });

    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([{ value: 100 }]),
      }),
    });

    // Mock projection update
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce({}),
      }),
    });

    const result = await DeleteTransaction(mockTransactionId);

    expect(db.select).toHaveBeenCalledTimes(4); // Transaction, projection, income, outcome
    expect(db.delete).toHaveBeenCalledWith(transactions);
    expect(db.update).toHaveBeenCalledWith(projections);
    expect(result).toEqual({ message: 'Transaction deleted successfully' });
  });

  it('should throw an error if the transaction is not found', async () => {
    const mockTransactionId = '12345';

    // Mock transaction query to return an empty array
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    await expect(DeleteTransaction(mockTransactionId)).rejects.toThrow('Transaction not found');
  });
});
