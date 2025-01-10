import React from 'react';

interface FilterTasksProps {
    onFilter: (title: string, completed: string, userId: string) => void;
}

const FilterTasks: React.FC<FilterTasksProps> = ({onFilter}) => {
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const title = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[type="text"]')?.value || '';
    const completed = (e.target as HTMLFormElement).querySelector<HTMLSelectElement>('select')?.value || '';
    const userId = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[placeholder="Filtrar por usuário"]')?.value || '';
    onFilter(title, completed, userId);
  }
  return (
     <form onSubmit={handleFilter}>
       {/* Formulário para filtrar tarefas */}
       <h2>Filtrar Tarefas</h2>
       <input type="text" placeholder="Filtrar por título" />
       <select>
           <option value="">Todos</option>
           <option value="true">Concluídas</option>
           <option value="false">Pendente</option>
       </select>
       <input type="text" placeholder="Filtrar por usuário" />
       <button>Filtrar</button>
     </form>
   );
};

export default FilterTasks;
export {};