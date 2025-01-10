const { Task, User } = require('../database/models');
const { Sequelize } = require('sequelize');

// Adicionar nova tarefa
exports.addTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }
    const newTask = await Task.create({
      title,
      description,
      dueDate,
      userId: req.userId
    });
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return res.status(500).json({ message: 'Erro ao adicionar tarefa.' , error: error.message });
  }
};

// Listar todas as tarefas do usuário com filtros
 exports.listTasks = async (req, res) => {
     try {
         const { title, completed, userId } = req.query;
         const whereClause = {
             userId: req.userId,
         };

         if (title) {
             whereClause.title = { [Sequelize.Op.like]: `%${title}%` };
         }
         if (completed !== undefined) {
             whereClause.completed = completed === 'true';
         }

        if (userId) {
             const user = await User.findByPk(userId);
             if(!user) {
                 return res.status(400).json({message: 'Usuário não encontrado'});
             }
             whereClause.userId = userId;
        }
       
         const tasks = await Task.findAll({
             where: whereClause,
             order: [['createdAt', 'DESC']] // Adicionar ordenação por data de criação
         });
         return res.status(200).json(tasks);
     } catch (error) {
         console.error('Erro ao listar tarefas:', error);
         return res.status(500).json({ message: 'Erro ao listar tarefas.', error: error.message });
     }
 };

// Atualizar tarefa
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
    task.title = title;
    task.description = description;
    task.dueDate = dueDate; 
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ message: 'Erro ao atualizar tarefa.', error: error.message });
  }
};

// Marcar tarefa como concluída
   exports.completeTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ where: { id, userId: req.userId } });
        if (!task) {
          return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }
        task.completed = !task.completed; // Alterna o status de concluído
        await task.save();
        return res.status(200).json(task);
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      return res.status(500).json({ message: 'Erro ao concluir tarefa.' , error: error.message });
    }
  };

// Excluir tarefa
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return res.status(500).json({ message: 'Erro ao excluir tarefa.', error: error.message });
  }
};