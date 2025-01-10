const { authenticateToken } = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const { mockRequest, mockResponse } = require('./mock');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar next() se um token válido for fornecido', async () => {
      const token = 'validToken';
      const req = mockRequest({
           headers: { authorization: `Bearer ${token}` }
      });
      const res = mockResponse();
        const next = jest.fn();

      const decodedToken = { id: 1 };
      jwt.verify.mockImplementation((token, secret, callback) => {
         callback(null, decodedToken)
      });


      await authenticateToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
      expect(req.userId).toBe(1);
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 401 se nenhum token for fornecido', async () => {
    const req = mockRequest({ headers: {} });
    const res = mockResponse();
    const next = jest.fn();

    await authenticateToken(req, res, next);

     expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 se um token inválido for fornecido', async () => {
      const token = 'invalidToken';
    const req = mockRequest({
      headers: { authorization: `Bearer ${token}` }
    });
    const res = mockResponse();
        const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token inválido.'));
    });

    await authenticateToken(req, res, next);

     expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido.' });
     expect(next).not.toHaveBeenCalled();
  });
});