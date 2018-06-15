import { UPDATE_FOCUSED_IDEA  } from '../actions/actionTypes';

export const focusedIdea = (state = '', action) => {
    switch (action.type) {
        case UPDATE_FOCUSED_IDEA:
            return action.ideaId;
        default:
            return state
    }
}

