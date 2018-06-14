import { UPDATE_FILTERED_IDEAS, ADD_FILTERED_IDEA } from '../actions/actionTypes';
import settings from '../config';

export const filteredIdeas = (state = [], action) => {
    switch (action.type) {
        case UPDATE_FILTERED_IDEAS:
            return action.ideas;
        case ADD_FILTERED_IDEA:
            let newState = state.slice();
            newState.push(action.idea)
            return newState;
        default:
            return state
    }
}

