import {DRAWER_EXTEND, DRAWER_FOLD} from '../actions/actionTypes';
const isDrawerExtended = (state = false, action) => {
    switch (action.type) {
        case DRAWER_EXTEND:
            return true
            case DRAWER_FOLD:
            return false
        default:
            return state
    }
}

export default isDrawerExtended