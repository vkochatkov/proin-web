import { createReducer } from "redux-act";
import { setActiveTabIndex } from "../../actions/activeTabIndex";

const initialState = 0;

export const activeTabIndex = createReducer({}, initialState);

activeTabIndex.on(setActiveTabIndex, (_, payload) => payload);
