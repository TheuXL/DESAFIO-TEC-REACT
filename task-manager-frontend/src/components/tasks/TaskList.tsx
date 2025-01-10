import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onComplete }) => {
  return (
    <div className="task-list-container">
      {tasks.map((task) => (
        <div className="task-item" key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Vence em: {task.dueDate || 'Sem data'}</p>
          <button onClick={() => onEdit(task.id)}>Editar</button>
          <button onClick={() => onDelete(task.id)}>Excluir</button>
      

        </div>
      ))}
    </div>
  );
};

export default TaskList;
