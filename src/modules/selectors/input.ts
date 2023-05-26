import { RootState } from '../store/store';

export const getIsActiveInputStatus = (state: RootState) =>
  state.input.isActiveInput;
