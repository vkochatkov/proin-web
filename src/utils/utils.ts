import { IStatusLabels } from '../modules/types/currentProjectTasks';

// drag and drop reorder
export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getFirstLetter = (name: string) => name.charAt(0).toUpperCase();

export const getStatusLabel = (status: string) => {
  const statusLabels: IStatusLabels = {
    new: 'Новий',
    'in progress': 'У процесі',
    done: 'Зроблено',
    canceled: 'Відмінено',
  };

  return statusLabels[status];
};
