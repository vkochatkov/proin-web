import { RootState } from '../store/store';

export const getAuth = (state: RootState) => state.user;
