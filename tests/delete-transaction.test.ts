import { db } from '../src/db'; 
import { transactions } from '../src/db/schema';
import { DeleteTransaction } from '../src/functions/delete-transaction';

jest.mock('../src/db')

describe('deleteTransaction', () => {
  it('should delete a transaction and return a success message', async () => {
    
    const mockTransactionId = '12345';
    
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockResolvedValueOnce({}),
    });

    const result = await DeleteTransaction(mockTransactionId);

    expect(db.delete).toHaveBeenCalledWith(transactions);
    expect(result).toEqual({ message: 'Transaction deleted successfully' });
  });
});
