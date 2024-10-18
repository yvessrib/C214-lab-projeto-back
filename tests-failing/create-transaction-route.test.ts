import fastify from 'fastify';
import { createTransactionRoute } from '../src/http/routes/create-transaction-route';
import { createTransaction } from '../src/functions/create-transaction';

// Mock do createTransaction
jest.mock('../src/functions/create-transaction');

// Mock do banco de dados, caso necessário
jest.mock('../src/db');

describe('POST /transactions', () => {
  let app: ReturnType<typeof fastify>;

  beforeAll(async () => {
    app = fastify();
    await app.register(createTransactionRoute);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a transaction and return the correct response', async () => {
    // Mock da função createTransaction para retornar uma transação simulada
    const mockTransaction = {
      title: 'Pagamento de Aluguel',
      description: 'Aluguel referente ao mês de setembro',
      value: '1500.00',
      installments: 1,
      endsAt: new Date('2024-10-27T00:00:00Z'),
      type: 'outcome',
    };

    (createTransaction as jest.Mock).mockResolvedValue(
      mockTransaction
    );

    // Simula a requisição para a rota
    const response = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        title: 'Pagamento de Aluguel',
        description: 'Aluguel referente ao mês de setembro',
        value: '1500.00',
        installments: 1,
        endsAt: '2024-10-01T00:00:00Z',
        type: 'outcome',
      },
    });

    // Verifica se o status retornado é 200
    expect(response.statusCode).toBe(200);

    // Verifica se a função createTransaction foi chamada corretamente
    // expect(createTransaction).toHaveBeenCalledWith({
    //   title: 'Pagamento de Aluguel',
    //   description: 'Aluguel referente ao mês de setembro',
    //   value: '1500.00',
    //   installments: 1,
    //   endsAt: new Date('2024-10-01T00:00:00Z'),
    //   type: 'outcome',
    // });

    // Verifica se a resposta contém os dados esperados
    // const jsonResponse = JSON.parse(response.body);
    // expect(jsonResponse.transaction).toEqual(mockTransaction);
  });

  // it('should return 400 if validation fails', async () => {
  //   // Envia uma requisição com dados inválidos
  //   const response = await app.inject({
  //     method: 'POST',
  //     url: '/transactions',
  //     payload: {
  //       // Faltando alguns campos obrigatórios
  //       description: 'Aluguel referente ao mês de setembro',
  //       value: '1500.00',
  //       installments: 1,
  //       endsAt: '2024-10-01T00:00:00Z',
  //       type: 'outcome',
  //     },
  //   });

  //   // Verifica se o status retornado é 400 (erro de validação)
  //   expect(response.statusCode).toBe(400);
  // });
});
