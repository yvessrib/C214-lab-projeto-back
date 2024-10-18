import { db } from '../src/db'; 
import { getTransactions } from '../src/functions/get-transactions';

jest.mock('../src/db')

describe('getTransactions', () => {
  it('should return a list of transactions', async () => {

    const mockTransactions = [
      {
        id: '1',
        title: 'Compra',
        description: 'Descrição da compra',
        value: '100.00',
        installments: 1,
        createdAt: '2024-10-16T18:09:43.192Z',
        endsAt: '2024-10-25T00:00:00.000Z',
        type: 'outcome'
      },
      {
        id: '2',
        title: 'Venda',
        description: 'Descrição da venda',
        value: '200.00',
        installments: 1,
        createdAt: '2024-10-18T00:01:15.175Z',
        endsAt: '2024-10-25T00:00:00.000Z',
        type: 'income'
      }
    ];

    (db.select as jest.Mock).mockReturnValue({
      from: jest.fn().mockResolvedValueOnce(mockTransactions)
    });

    const result = await getTransactions();

    expect(result).toEqual(mockTransactions);
    expect(db.select).toHaveBeenCalled();
  });
});
