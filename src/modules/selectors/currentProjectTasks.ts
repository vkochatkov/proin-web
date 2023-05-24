import { RootState } from '../store/store';

export const getTasks = (state: RootState) => state.currentProjectTasks;
