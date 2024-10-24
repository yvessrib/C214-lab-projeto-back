import { updateTransaction } from '../src/functions/update-transaction';
import { db } from '../src/db';
import { transactions } from '../src/db/schema';
import { handleTransactionUpdate } from '../src/functions/handle-transaction-update';

jest.mock('../src/db');
jest.mock('../src/functions/handle-transaction-update');

describe('updateTransaction', () => {
  it('should update the specified fields of a transaction and call handleTransactionUpdate', async () => {
    const mockTransactionId = '12345';
    const mockUpdateData = {
      title: 'New Title',
      value: 150.00,
    };

    const mockOldTransaction = {
      id: mockTransactionId,
      title: 'Old Title',
      value: 100.00,
      createdAt: new Date('2024-05-15T00:00:00Z'),
    };

    const mockNewTransaction = {
      ...mockOldTransaction,
      ...mockUpdateData,
    };

    // Mock the select query for the old transaction
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([mockOldTransaction]),
      }),
    });

    // Mock the update query
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce({}),
      }),
    });

    // Call the updateTransaction function
    const result = await updateTransaction(mockTransactionId, mockUpdateData);

    // Assertions
    expect(db.select).toHaveBeenCalledWith(); // Called to fetch the old transaction
    expect(db.update).toHaveBeenCalledWith(transactions);
    expect(db.update).toHaveBeenCalledTimes(1);
    expect(handleTransactionUpdate).toHaveBeenCalledWith(mockOldTransaction, mockNewTransaction);
    expect(result).toEqual('Transaction updated successfully');
  });

  it('should throw an error if the transaction is not found', async () => {
    const mockTransactionId = '12345';
    const mockUpdateData = {
      title: 'New Title',
      value: 150.00,
    };

    // Mock the select query to return an empty array (transaction not found)
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValueOnce({
        where: jest.fn().mockResolvedValueOnce([]),
      }),
    });

    // Assert that an error is thrown
    await expect(updateTransaction(mockTransactionId, mockUpdateData)).rejects.toThrow(`Transaction with ID ${mockTransactionId} not found`);
  });
});
