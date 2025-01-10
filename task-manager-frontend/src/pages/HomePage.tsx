import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import FilterTasks from '../components/tasks/FilterTasks';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
}

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const { token } = useAuth();

  const fetchTasks = useCallback(async (title = '', completed = '', userId = '') => {
    try {
      const response = await api.get(`/tasks?title=${title}&completed=${completed}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterTasks = useCallback((title: string, completed: string, userId: string) => {
    fetchTasks(title, completed, userId);
  }, [fetchTasks]);

  const handleAddTask = async (task: { title: string; description: string; dueDate: string }) => {
    try {
      await api.post('/tasks', task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const handleUpdateTask = async (task: { title: string; description: string; dueDate: string }) => {
    try {
      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit.id}`, task, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setTaskToEdit(null);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      setTaskToEdit(task);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleCompleteTask = async (id: number) => {
    try {
      const task = tasks.find((task) => task.id === id);
  
      if (task) {
        await api.patch(
          `/tasks/${id}`,
          { completed: !task.completed }, // Inverte o status atual
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchTasks(); // Atualiza a lista de tarefas após a alteração
      }
    } catch (error) {
      console.error('Erro ao alterar o status da tarefa:', error);
    }
  };
  

  return (
    <Layout>
      <div className="homepage-container">
        <h1>Gerenciar Tarefas</h1>
        <TaskForm
          onSubmit={taskToEdit ? handleUpdateTask : handleAddTask}
          initialTask={
            taskToEdit
              ? {
                  title: taskToEdit.title,
                  description: taskToEdit.description,
                  dueDate: taskToEdit.dueDate || '',
                }
              : undefined
          }
        />
        <FilterTasks onFilter={handleFilterTasks} />
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
