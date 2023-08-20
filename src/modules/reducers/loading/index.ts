import { createReducer } from 'redux-act';
import {
  endFilesLoading,
  endLoading,
  startFilesLoading,
  startLoading,
  startLogoLoading,
  endLogoLoading,
  // startSliderLoading,
  // endSliderLoading,
} from '../../actions/loading';

const initialState = {
  global: false,
  files: false,
  logo: false,
  slider: false,
};

export const loadingReducer = createReducer({}, initialState);

loadingReducer.on(startLoading, (state) => {
  return {
    ...state,
    global: true,
  };
});

loadingReducer.on(endLoading, () => initialState);

loadingReducer.on(startFilesLoading, (state) => ({
  ...state,
  files: true,
}));

loadingReducer.on(endFilesLoading, (state) => ({
  ...state,
  files: false,
}));

loadingReducer.on(startLogoLoading, (state) => ({
  ...state,
  logo: true,
}));

loadingReducer.on(endLogoLoading, (state) => ({
  ...state,
  logo: false,
}));

// loadingReducer.on(startSliderLoading, (state) => ({
//   ...state,
//   slider: true
// }));

// loadingReducer.on(endSliderLoading, (state) => ({
//   ...state,
//   slider: false
// }))
