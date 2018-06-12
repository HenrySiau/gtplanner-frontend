import { UPDATE_FILTERED_IDEAS} from '../actions/actionTypes';
import settings from '../config';

export const filteredIdeas = (state = [], action) => {
    switch (action.type) {
        case UPDATE_FILTERED_IDEAS:
            return action.ideas;
        default:
            return state
    }
}

