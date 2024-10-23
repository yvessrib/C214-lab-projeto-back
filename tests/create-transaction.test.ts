import { db } from "../src/db";
import { createTransaction } from "../src/functions/create-transaction";
import { transactions } from "../src/db/schema";

// Mock do banco de dados
jest.mock('../src/db');

describe('createTransaction', () => {
  it('should create a transaction with the correct data', async () => {
    
    const transactionData = {
      title: 'Pagamento de Aluguel',
      description: 'Aluguel referente ao mês de setembro',
      value: 1500.00,
      installments: 1,
      endsAt: new Date('2024-10-01T00:00:00Z'),
      type: 'outcome',
      createdAt: new Date('2024-9-021T00:00:00Z'),
    };

    const mockInsertResult = [
      {
        ...transactionData,
        id: 'unique-transaction-id',
      }
    ];

    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce(mockInsertResult),
      }),
    })

    const result = await createTransaction(transactionData);

    expect(result.transaction).toEqual(mockInsertResult[0]);
    expect(db.insert).toHaveBeenCalledWith(transactions);
    expect(db.insert).toHaveBeenCalledTimes(1);
  });
});