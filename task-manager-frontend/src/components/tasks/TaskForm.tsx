import React, { useState } from 'react';

interface TaskFormProps {
    onSubmit: (task: { title: string; description: string; dueDate: string }) => void;
    initialTask?: { title: string; description: string; dueDate: string };
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialTask }) => {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, description, dueDate });
        setTitle('');
        setDescription('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialTask ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>
            <div>
                <label htmlFor="title">Título</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label htmlFor="description">Descrição</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="dueDate">Data de Vencimento</label>
                <input
                    type="datetime-local"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <button type="submit">{initialTask ? 'Editar' : 'Adicionar'}</button>
        </form>
    );
};

export default TaskForm;
export {};