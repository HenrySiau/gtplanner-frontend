import {TOGGLE_DRAWER} from '../actions/actionTypes';
const isDrawerOpen = (state = false, action) => {
    switch (action.type) {
        case TOGGLE_DRAWER:
            return !state
        default:
            return state
    }
}

export default isDrawerOpen