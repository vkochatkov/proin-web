import { RootState } from '../store/store';

export const getIsLoading = (state: RootState) => state.isLoading.global;
export const getIsFilesLoading = (state: RootState) => state.isLoading.files;
