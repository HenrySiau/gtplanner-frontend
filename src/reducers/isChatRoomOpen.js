import {TOGGLE_CHAT_ROOM_OPEN} from '../actions/actionTypes';
const isChatRoomOpen = (state = true, action) => {
    switch (action.type) {
        case TOGGLE_CHAT_ROOM_OPEN:
            return !state
        default:
            return state
    }
}

export default isChatRoomOpen