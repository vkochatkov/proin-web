import { IStatusLabels } from '../modules/types/projectTasks';
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
