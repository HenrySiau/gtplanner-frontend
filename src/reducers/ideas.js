import { UPDATE_IDEAS, ADD_IDEA } from '../actions/actionTypes';
import settings from '../config';

export const ideas = (state = [], action) => {
    switch (action.type) {
        case UPDATE_IDEAS:
            return action.ideas;
        case ADD_IDEA:
            let newState = state.slice();
            newState.push(action.idea);
            console.log('idea: ' + action.idea);
            console.log('state updated: ' + newState);
            return newState
        default:
            return state
    }
}

