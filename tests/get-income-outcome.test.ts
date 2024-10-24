import { db } from '../src/db';
import { getIncomeOutcomeOfTheYear } from '../src/functions/get-income-outcome';

jest.mock('../src/db'); // Mock do banco de dados

describe('getIncomeOutcomeOfTheYear', () => {

  it('it should return the total income and outcome for the current year', async () => {
    const mockIncomeResults = [{ totalIncome: 1000 }];
    const mockOutcomeResults = [{ totalOutcome: 500 }];

    // Mock para totalIncome
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockIncomeResults)
      })
    });

    // Mock para totalOutcome
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockOutcomeResults)
      })
    });

    const result = await getIncomeOutcomeOfTheYear('2024');

    expect(result).toEqual({
      totalIncome: 1000,
      totalOutcome: 500,
    });
    expect(db.select).toHaveBeenCalledTimes(2);
  });

  it('it should return 0 for the total income and outcome for the current year', async () => {
    const mockIncomeResults = [{ totalIncome: 0 }];
    const mockOutcomeResults = [{ totalOutcome: 0 }];

    // Mock para totalIncome
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockIncomeResults)
      })
    });

    // Mock para totalOutcome
    (db.select as jest.Mock).mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(mockOutcomeResults)
      })
    });

    const result = await getIncomeOutcomeOfTheYear('2023');

    expect(result).toEqual({
      totalIncome: 0,
      totalOutcome: 0,
    });
    expect(db.select).toHaveBeenCalledTimes(4);
  });
});