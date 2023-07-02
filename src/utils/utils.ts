import { IStatusLabels } from '../modules/types/tasks';
import { IFile } from '../modules/types/mainProjects';

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

export const getTransactionLabel = (key: string) => {
  const transactionLabels: { [key: string]: string } = {
    income: 'Доходи',
    expenses: 'Витрати',
    transfer: 'Переказ',
  };

  return transactionLabels[key];
};

export const updateEnitites = (entities: any[], id: string, files: IFile[]) => {
  const entityIndex = entities.findIndex((entity) => entity._id === id);

  if (entityIndex === -1) {
    return;
  }

  const updatedEntity = {
    ...entities[entityIndex],
    files,
  };

  const updatedEnities = [
    ...entities.slice(0, entityIndex),
    updatedEntity,
    ...entities.slice(entityIndex + 1),
  ];

  return { updatedEntity, updatedEnities };
};

export const updateObjects = (array: any, obj: any) => {
  return array.map((item: any) => (item._id === obj._id ? obj : item));
};
