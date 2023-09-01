import { createReducer } from "redux-act";
import { setIdForDelete } from "../../actions/idForRemove";

const initialState = '';

export const idForRemove = createReducer({}, initialState);

idForRemove.on(setIdForDelete, (_, payload) => payload);
