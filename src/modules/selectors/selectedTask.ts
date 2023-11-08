import { RootState } from '../store/store';

export const getSelectedTaskId = (state: RootState) => state.selectedTask;
