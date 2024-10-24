import { db } from '../src/db';
import { createTransaction } from '../src/functions/create-transaction';
import { transactions, projections } from '../src/db/schema';
import { sql } from 'drizzle-orm';

// Mock do banco de dados
jest.mock('../src/db');

describe('createTransaction', () => {
  it('should create a transaction with the correct data and update projections', async () => {
    const transactionData = {
      title: 'Pagamento de Aluguel',
      description: 'Aluguel referente ao mês de setembro',
      value: 1500.00,
      installments: 1,
      endsAt: new Date('2024-10-01T00:00:00Z'),
      type: 'outcome',
      createdAt: new Date('2024-09-21T00:00:00Z'),
    };

    const mockInsertResult = [
      {
        ...transactionData,
        id: 'unique-transaction-id',
      },
    ];

    const mockProjectionResult = [
      {
        year: 2024,
        month: 9,
        actualIncome: 0,
        actualOutcome: 1500.00,
      },
    ];

    const mockTransactionsOfMonth = [
      { id: 't1', type: 'income', value: 1000, createdAt: new Date('2024-09-05') },
      { id: 't2', type: 'outcome', value: 500, createdAt: new Date('2024-09-10') },
    ];

    // Mock da operação de inserção
    (db.insert as jest.Mock).mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce(mockInsertResult),
      }),
    });

    // Mock da operação de select para projeções
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockProjectionResult),
      }),
    });

    // Mock da operação de select para calcular income/outcome no mês
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockTransactionsOfMonth), // Agora retorna um array
      }),
    });

    // Mock da operação de update nas projeções
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce({}),
      }),
    });

    const result = await createTransaction(transactionData);

    // Verificações
    expect(db.insert).toHaveBeenCalledWith(transactions);
    expect(db.insert).toHaveBeenCalledTimes(1);
    expect(db.select).toHaveBeenCalledTimes(1); // Para as projeções e transações
    expect(db.update).toHaveBeenCalledWith(projections); // Atualização das projeções
  });
});
