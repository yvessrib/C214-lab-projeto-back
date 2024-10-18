import { updateTransaction } from '../src/functions/update-transaction';
import { db } from '../src/db';
import { transactions } from '../src/db/schema';

jest.mock('../src/db');

describe('updateTransaction', () => {
  it('should update the specified fields of a transaction', async () => {
    const mockTransactionId = '12345';
    
    const mockUpdateData = {
      title: 'New Title',
      value: '150.00',
    };

    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce({}),
      }),
    });

    const result = await updateTransaction(mockTransactionId, mockUpdateData);

    expect(db.update).toHaveBeenCalledWith(transactions);
    expect(result).toEqual('Transaction updated successfully');
    expect(db.update).toHaveBeenCalledTimes(1);
  });
});
