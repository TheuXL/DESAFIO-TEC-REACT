const taskController = require('../controllers/taskController');
const { Task, User, sequelize } = require('../database/models');
const { mockRequest, mockResponse } = require('./mock');
const { Sequelize } = require('sequelize');

const { Op } = Sequelize;

jest.mock('../database/models', () => {
    const originalModule = jest.requireActual('../database/models');
    return {
        ...originalModule,
        sequelize: {
            ...originalModule.sequelize,
            options: {
                ...originalModule.sequelize.options,
                dialect: 'sqlite'
            }
        },
        Task: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
        },
        User: {
            findByPk: jest.fn()
        },
    };
});

describe('Task Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('addTask', () => {
         it('deve adicionar uma nova tarefa e retorná-la com o status 201', async () => {
            const req = mockRequest({
                body: { title: 'Test Task', description: 'Test Description', dueDate: '2024-12-31' },
                userId: 1
              });
            const res = mockResponse();
            const newTask = { id: 1, title: 'Test Task', description: 'Test Description', userId: 1, dueDate: '2024-12-31' };
            
            Task.create.mockResolvedValue(newTask);

            await taskController.addTask(req, res);

            expect(Task.create).toHaveBeenCalledWith({ title: 'Test Task', description: 'Test Description', userId: 1, dueDate: '2024-12-31' });
             expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newTask);
        });

        it('deve retornar 400 se o título ou a descrição estiverem faltando', async () => {
           const req = mockRequest({
            body: {  description: 'Test Description' },
                userId: 1
           });
            const res = mockResponse();
            
             await taskController.addTask(req, res);
                
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Título e descrição são obrigatórios.' });

        });

         it('deve retornar 500 se ocorrer um erro durante a criação da tarefa', async () => {
             const req = mockRequest({
                body: { title: 'Test Task', description: 'Test Description', dueDate: '2024-12-31' },
                userId: 1
             });
            const res = mockResponse();

            Task.create.mockRejectedValue(new Error('Database error'));

            await taskController.addTask(req, res);
           
             expect(res.status).toHaveBeenCalledWith(500);
             expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao adicionar tarefa.', error: 'Database error' });
         });
     });

     describe('listTasks', () => {
       it('deve listar todas as tarefas de um usuário sem filtros', async () => {
             const req = mockRequest({ userId: 1, query: {} });
             const res = mockResponse();
             const tasks = [{ id: 1, title: 'Task 1', description: 'Description 1', userId: 1 }];
            
            Task.findAll.mockResolvedValue(tasks);

             await taskController.listTasks(req, res);
             
             expect(Task.findAll).toHaveBeenCalledWith({ where: { userId: 1 }, order: [['createdAt', 'DESC']] });
             expect(res.status).toHaveBeenCalledWith(200);
             expect(res.json).toHaveBeenCalledWith(tasks);
        });
       
       it('deve listar as tarefas com filtro por título', async () => {
            const req = mockRequest({
                userId: 1,
                query: { title: 'test' }
            });
            const res = mockResponse();
            const tasks = [{ id: 1, title: 'Task 1', description: 'Description 1', userId: 1 }];
            Task.findAll.mockResolvedValue(tasks);
            await taskController.listTasks(req, res);
            expect(Task.findAll).toHaveBeenCalledWith({
              where: {
                userId: 1,
                 title: { [Op.like]: '%test%' }
             },
              order: [['createdAt', 'DESC']]
          });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(tasks);
         });

        it('deve listar as tarefas com filtro por concluídas', async () => {
          const req = mockRequest({
            userId: 1,
             query: { completed: 'true' }
            });
            const res = mockResponse();
            const tasks = [{ id: 1, title: 'Task 1', description: 'Description 1', userId: 1 }];
            Task.findAll.mockResolvedValue(tasks);
    
             await taskController.listTasks(req, res);
    
             expect(Task.findAll).toHaveBeenCalledWith({
              where: {
                  userId: 1,
                  completed: true
              },
                order: [['createdAt', 'DESC']]
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(tasks);
        });

        it('deve listar as tarefas com filtro por userId', async () => {
            const req = mockRequest({
              userId: 1,
             query: { userId: 2 }
           });
             const res = mockResponse();
             const tasks = [{ id: 1, title: 'Task 1', description: 'Description 1', userId: 2 }];
             const user = { id: 2, email: 'test2@example.com' };
             User.findByPk.mockResolvedValue(user);
             Task.findAll.mockResolvedValue(tasks);

            await taskController.listTasks(req, res);
        
           expect(User.findByPk).toHaveBeenCalledWith(2);
            expect(Task.findAll).toHaveBeenCalledWith({
             where: {
                 userId: 2
              },
                order: [['createdAt', 'DESC']]
            });
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith(tasks);
      });

        it('deve retornar 400 se o usuário não for encontrado ao filtrar por userId', async () => {
            const req = mockRequest({
             userId: 1,
              query: { userId: 2 }
             });
            const res = mockResponse();
            User.findByPk.mockResolvedValue(null);

            await taskController.listTasks(req, res);
    
            expect(User.findByPk).toHaveBeenCalledWith(2);
             expect(res.status).toHaveBeenCalledWith(400);
             expect(res.json).toHaveBeenCalledWith({ message: 'Usuário não encontrado' });
         });

         it('deve retornar 500 se ocorrer um erro durante a listagem de tarefas', async () => {
             const req = mockRequest({ userId: 1, query: {} });
             const res = mockResponse();

             Task.findAll.mockRejectedValue(new Error('Database error'));
             await taskController.listTasks(req, res);
            
             expect(res.status).toHaveBeenCalledWith(500);
             expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao listar tarefas.', error: 'Database error' });
          });
     });

     describe('updateTask', () => {
          it('deve atualizar uma tarefa com sucesso', async () => {
            const req = mockRequest({
              params: { id: 1 },
                body: { title: 'Updated Task', description: 'Updated Description', dueDate: '2024-12-31' },
                userId: 1
            });
            const res = mockResponse();
            const existingTask = { id: 1, title: 'Old Task', description: 'Old Description', userId: 1, save: jest.fn() };
            Task.findOne.mockResolvedValue(existingTask);
            await taskController.updateTask(req, res);
    
           expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
           expect(existingTask.title).toBe('Updated Task');
           expect(existingTask.description).toBe('Updated Description');
          expect(existingTask.dueDate).toBe('2024-12-31');
            expect(existingTask.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(existingTask);
        });

         it('deve retornar 400 se o título ou a descrição estiverem faltando', async () => {
             const req = mockRequest({
             params: { id: 1 },
             body: { description: 'Updated Description' },
                userId: 1
             });
           const res = mockResponse();

           await taskController.updateTask(req, res);
                
            expect(res.status).toHaveBeenCalledWith(400);
             expect(res.json).toHaveBeenCalledWith({ message: 'Título e descrição são obrigatórios.' });
        });
    
        it('deve retornar 404 se a tarefa não for encontrada', async () => {
             const req = mockRequest({
               params: { id: 1 },
              body: { title: 'Updated Task', description: 'Updated Description' },
              userId: 1
             });
           const res = mockResponse();

            Task.findOne.mockResolvedValue(null);

            await taskController.updateTask(req, res);

             expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
             expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
         });

        it('deve retornar 500 se ocorrer um erro durante a atualização da tarefa', async () => {
            const req = mockRequest({
                params: { id: 1 },
               body: { title: 'Updated Task', description: 'Updated Description', dueDate: '2024-12-31' },
                userId: 1
            });
            const res = mockResponse();

            Task.findOne.mockRejectedValue(new Error('Database error'));

            await taskController.updateTask(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao atualizar tarefa.', error: 'Database error' });
        });
     });
    
    describe('completeTask', () => {
        it('deve alternar o status de conclusão da tarefa e retornar a tarefa atualizada', async () => {
            const req = mockRequest({ params: { id: 1 }, userId: 1 });
            const res = mockResponse();
            const task = { id: 1, completed: false, save: jest.fn() };
            Task.findOne.mockResolvedValue(task);

            await taskController.completeTask(req, res);

            expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
            expect(task.completed).toBe(true);
             expect(task.save).toHaveBeenCalled();
             expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(task);
        });

         it('deve retornar 404 se a tarefa não for encontrada', async () => {
           const req = mockRequest({ params: { id: 1 }, userId: 1 });
             const res = mockResponse();

             Task.findOne.mockResolvedValue(null);

             await taskController.completeTask(req, res);
        
            expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
            expect(res.status).toHaveBeenCalledWith(404);
             expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
       });
        
        it('deve retornar 500 se ocorrer um erro durante a conclusão da tarefa', async () => {
             const req = mockRequest({ params: { id: 1 }, userId: 1 });
            const res = mockResponse();

            Task.findOne.mockRejectedValue(new Error('Database error'));

            await taskController.completeTask(req, res);

           expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao concluir tarefa.', error: 'Database error' });
        });
    });

     describe('deleteTask', () => {
         it('deve excluir uma tarefa com sucesso', async () => {
            const req = mockRequest({ params: { id: 1 }, userId: 1 });
             const res = mockResponse();
             const task = { id: 1, destroy: jest.fn() };
            
            Task.findOne.mockResolvedValue(task);

           await taskController.deleteTask(req, res);

            expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
            expect(task.destroy).toHaveBeenCalled();
             expect(res.status).toHaveBeenCalledWith(204);
           expect(res.send).toHaveBeenCalled();
        });

         it('deve retornar 404 se a tarefa não for encontrada', async () => {
            const req = mockRequest({ params: { id: 1 }, userId: 1 });
           const res = mockResponse();

            Task.findOne.mockResolvedValue(null);

             await taskController.deleteTask(req, res);

            expect(Task.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
           expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Tarefa não encontrada.' });
        });
       
       it('deve retornar 500 se ocorrer um erro durante a exclusão da tarefa', async () => {
        const req = mockRequest({ params: { id: 1 }, userId: 1 });
            const res = mockResponse();

            Task.findOne.mockRejectedValue(new Error('Database error'));

            await taskController.deleteTask(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao excluir tarefa.', error: 'Database error' });
        });
     });
});