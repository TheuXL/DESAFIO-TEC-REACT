import React from 'react';

interface TaskItemProps {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    dueDate: string | null;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
    id,
    title,
    description,
    completed,
    dueDate,
    onEdit,
    onDelete,
    onComplete,
}) => {
    const handleComplete = () => {
        onComplete(id); // Correct: use onComplete here
    };
    const handleDelete = () => {
        onDelete(id);
    };
    const handleEdit = () => {
        onEdit(id);
    };
    return (
        <li>
            <h2>{title}</h2>
            <p>{description}</p>
            {dueDate ? (
                <p>
                    Data de Vencimento: {new Date(dueDate).toLocaleDateString()} {new Date(dueDate).toLocaleTimeString()}
                </p>
            ) : null}
            <div>
                <button onClick={handleEdit}>Editar</button>
                <button onClick={handleDelete}>Excluir</button>
                <button style={{ backgroundColor: completed ? 'green' : 'gray' }} onClick={handleComplete}>
                    {completed ? 'Concluído' : 'Pendente'}
                </button>
            </div>
        </li>
    );
};

export default TaskItem;
export {};