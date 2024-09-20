const { Task } = require('../database/models');

// Adicionar nova tarefa
exports.addTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }
    const newTask = await Task.create({
      title,
      description,
      userId: req.userId
    });
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    return res.status(500).json({ message: 'Erro ao adicionar tarefa.' });
  }
};



// Listar todas as tarefas do usuário
exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    return res.status(500).json({ message: 'Erro ao listar tarefas.' });
  }
};

// Atualizar tarefa
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Título e descrição são obrigatórios.' });
    }
    const task = await Task.findOne({ where: { id, userId: req.userId } });
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' });
    }
    task.title = title;
    task.description = description;
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
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
    return res.status(500).json({ message: 'Erro ao concluir tarefa.' });
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
    return res.status(500).json({ message: 'Erro ao excluir tarefa.' });
  }
};
