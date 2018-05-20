import { UPDATE_IDEAS, ADD_IDEA} from '../actions/actionTypes';
import settings from '../config';

// export const filteredMarkerList = (state = [{lat: 10.794234, lng: 106.807000}, {lat: 10.794234, lng: 106.706541}], action) => {
export const ideas = (state = [], action) => {
    switch (action.type) {
        case UPDATE_IDEAS:
            return action.ideas;
        case ADD_IDEA:
        return state.push(action.idea)
        default:
            return state
    }
}

