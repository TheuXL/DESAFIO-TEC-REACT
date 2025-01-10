const authController = require('../controllers/authController');
const { User } = require('../database/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mockRequest, mockResponse } = require('./mock');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../database/models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

const jwtSecret = 'default_secret_key_for_dev';
process.env.JWT_SECRET = jwtSecret;

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('deve criar um novo usuário e retornar um token em caso de cadastro bem-sucedido', async () => {
            const req = mockRequest({
                body: { email: 'test@example.com', password: 'password123' }
            });
            const res = mockResponse();

            // Mock bcrypt.hash to return a resolved promise with a hashed password
            bcrypt.hash.mockResolvedValue('hashedPassword');

            // Mock User.findOne to return null (email doesn't exist)
            User.findOne.mockResolvedValue(null);

            // Mock User.create to return a newly created user
            User.create.mockResolvedValue({ id: 1, email: 'test@example.com' });

            // Mock jwt.sign to return a token
            jwt.sign.mockReturnValue('mockedToken');

            await authController.signup(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'hashedPassword' });
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Cadastro realizado com sucesso.', token: 'mockedToken' });
        });

        it('deve retornar 400 se o email já existir', async () => {
            const req = mockRequest({
                body: { email: 'test@example.com', password: 'password123' }
            });
            const res = mockResponse();

            User.findOne.mockResolvedValue({ email: 'test@example.com' });

            await authController.signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email já cadastrado.' });
            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        });

        it('deve retornar 500 em caso de erro durante o cadastro', async () => {
            const req = mockRequest({
              body: { email: 'test@example.com', password: 'password123' }
            });
             const res = mockResponse();
            
            User.findOne.mockRejectedValue(new Error('Database error'));
             User.create.mockRejectedValue(new Error('Database error'));

            await authController.signup(req, res);
             expect(User.findOne).toHaveBeenCalledTimes(1)
             expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao cadastrar usuário.', error: 'Database error' });
        });
    });

   
        


      it('deve retornar 404 se o usuário não for encontrado', async () => {
            const req = mockRequest({ body: { email: 'test@example.com', password: 'password123' } });
            const res = mockResponse();

            User.findOne.mockResolvedValue(null);

            await authController.login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado.' });
        });

        it('deve retornar 400 se a senha não corresponder', async () => {
            const req = mockRequest({ body: { email: 'test@example.com', password: 'wrongPassword' } });
            const res = mockResponse();
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
            User.findOne.mockResolvedValue(user);

            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Senha incorreta.' });
        });

       it('deve retornar 500 em caso de erro durante o login', async () => {
          const req = mockRequest({ body: { email: 'test@example.com', password: 'password123' } });
          const res = mockResponse();
            jwt.verify.mockImplementation((token, secret, callback) => {
              callback(new Error());
            });
          User.findOne.mockRejectedValue(new Error('Database error'));
          await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
           expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao fazer login.', error: expect.any(String) });
        });
    });
