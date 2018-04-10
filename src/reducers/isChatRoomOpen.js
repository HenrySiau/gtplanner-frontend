import { TOGGLE_CHAT_ROOM_OPEN, CHAT_ROOM_OPEN, CHAT_ROOM_CLOSE } from '../actions/actionTypes';
const isChatRoomOpen = (state = true, action) => {
    console.log(action);
    switch (action.type) {
        case TOGGLE_CHAT_ROOM_OPEN:
            return !state
        case CHAT_ROOM_OPEN:
            return true
        case CHAT_ROOM_CLOSE:
            return false
        default:
            return state
    }
}

export default isChatRoomOpen